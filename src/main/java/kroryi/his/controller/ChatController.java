package kroryi.his.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import kroryi.his.domain.ChatRoom;
import kroryi.his.domain.Member;
import kroryi.his.dto.ChatMessageDTO;
import kroryi.his.dto.ChatRoomDTO;
import kroryi.his.dto.MemberJoinDTO;
import kroryi.his.dto.MemberSecurityDTO;
import kroryi.his.repository.ChatRoomRepository;
import kroryi.his.service.ChatRoomService;
import kroryi.his.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@SessionAttributes("loggedInUser")
@Log4j2
@CrossOrigin(origins = "*") // 모든 출처를 허용 (보안상 좋지 않을 수 있으니 주의)
public class ChatController {

    private final MemberService memberService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomService chatRoomService;
    private final ChatRoomRepository chatRoomRepository;

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    // 현재 인증된 사용자 정보 가져오기
    @GetMapping("/auth/currentUser")
    public ResponseEntity<MemberJoinDTO> getCurrentUser() {
        // Spring Security 컨텍스트에서 인증 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 인증되지 않은 경우 401 반환
        }

        // 현재 사용자 정보를 MemberSecurityDTO로 캐스팅하여 반환
        MemberSecurityDTO currentUser = (MemberSecurityDTO) authentication.getPrincipal();
        return ResponseEntity.ok(new MemberJoinDTO(currentUser.getUsername(), currentUser.getName()));
    }

    // 채팅방 생성
    @PostMapping("/rooms")
    public ResponseEntity<ChatRoomDTO> createChatRoom(@RequestBody ChatRoomDTO chatRoomDTO, @AuthenticationPrincipal UserDetails userDetails) {
        String currentUserId = userDetails.getUsername(); // 현재 로그인된 사용자 ID
        List<String> memberMidsList = new ArrayList<>(chatRoomDTO.getMemberMids());

        log.info("채팅방 생성 요청: 방 이름 = {}, 멤버 = {}", chatRoomDTO.getRoomName(), memberMidsList);

        // 현재 사용자가 멤버 목록에 없으면 추가
        if (!memberMidsList.contains(currentUserId)) {
            memberMidsList.add(currentUserId);
            log.info("현재 사용자({})가 멤버 목록에 추가됨", currentUserId);
        }

        // 다인 채팅의 경우 recipientIds를 모든 멤버로 설정
        List<String> recipientIds = memberMidsList.size() > 1 ? memberMidsList : null;
        log.info("최종 멤버 목록: {}, 수신자 목록: {}", memberMidsList, recipientIds);

        // 채팅방 생성 및 DTO 반환
        ChatRoomDTO createdRoom = chatRoomService.createChatRoom(chatRoomDTO.getRoomName(), memberMidsList, recipientIds);
        log.info("채팅방 생성 완료: 채팅방 ID = {}, 방 이름 = {}, 멤버 = {}", createdRoom.getId(), createdRoom.getRoomName(), createdRoom.getMemberMids());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdRoom); // HTTP 201 상태 반환
    }

    // 현재 사용자의 모든 채팅방 목록 반환
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomDTO>> getUserChatRooms() {
        // 인증 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 인증되지 않은 경우 401 반환
        }

        String currentUserId = ((UserDetails) authentication.getPrincipal()).getUsername(); // 사용자 ID 가져오기
        List<ChatRoomDTO> rooms = chatRoomService.getAllChatRoomsForUserWithLastMessage(currentUserId); // 채팅방 조회
        return ResponseEntity.ok(rooms); // 채팅방 목록 반환
    }

    // 1:1 채팅방 생성 또는 기존 채팅방 반환
    @PostMapping("/private-room")
    public ResponseEntity<ChatRoomDTO> createOrGetPrivateChatRoom(@RequestParam String member1Mid,
                                                                  @RequestParam String member2Mid) {
        // 사용자 간 개인 채팅방 생성 또는 조회
        ChatRoomDTO chatRoom = chatRoomService.createOrGetPrivateChatRoom(member1Mid, member2Mid);
        return ResponseEntity.ok(chatRoom);
    }

    // 사용자 목록 반환
    @GetMapping("/member/list")
    public ResponseEntity<List<MemberJoinDTO>> getAllMembers() {
        List<MemberJoinDTO> members = memberService.getMembers(); // 모든 사용자 정보 조회
        return ResponseEntity.ok(members); // 사용자 목록 반환
    }

    // 특정 채팅방의 메시지 가져오기
    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessageDTO>> getMessages(@PathVariable Long roomId) {
        List<ChatMessageDTO> messages = chatRoomService.getMessagesByRoomId(roomId); // 채팅방의 메시지 조회
        return ResponseEntity.ok(messages); // 메시지 목록 반환
    }

    // 채팅방 삭제
    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<Void> deleteChatRoom(@PathVariable Long roomId) {
        chatRoomService.deleteChatRoom(roomId); // 채팅방 삭제
        return ResponseEntity.noContent().build(); // HTTP 204 반환
    }

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<ChatRoomDTO> getChatRoomById(@PathVariable Long roomId) {
        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(roomId);

        // 채팅방이 존재하지 않을 경우 404 반환
        if (chatRoomOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        ChatRoom chatRoom = chatRoomOptional.get();

        // 채팅방 이름이 null 또는 빈 문자열이면 기본값 설정
        String roomName = (chatRoom.getRoomName() != null && !chatRoom.getRoomName().isEmpty())
                ? chatRoom.getRoomName()
                : "알 수 없는 채팅방";

        // ChatRoomDTO 생성
        ChatRoomDTO chatRoomDTO = new ChatRoomDTO(
                chatRoom.getId(),
                roomName, // 안전한 이름 전달
                chatRoom.getMembers().stream()
                        .map(Member::getMid)
                        .collect(Collectors.toSet())
        );

        return ResponseEntity.ok(chatRoomDTO); // 올바른 DTO 반환
    }


    // 채팅 메시지 저장
    @PostMapping("/rooms/{roomId}/messages")
    public ResponseEntity<ChatMessageDTO> postMessage(
            @PathVariable Long roomId,
            @RequestBody ChatMessageDTO messageDTO) {
        messageDTO.setRoomId(roomId); // 메시지에 채팅방 ID 설정

        // 수신자가 설정되지 않은 경우 자동으로 설정
        if (messageDTO.getRecipientIds() == null) {
            List<String> recipientIds = determineRecipientIds(roomId, messageDTO.getSenderId());
            messageDTO.setRecipientIds(recipientIds);
        }

        log.info("Sending message from senderId: {} to recipientIds: {}", messageDTO.getSenderId(), messageDTO.getRecipientIds());

        // 메시지 저장 및 반환
        ChatMessageDTO savedMessage = chatRoomService.createMessage(
                roomId,
                messageDTO.getContent(),
                messageDTO.getSenderId(),
                messageDTO.getRecipientIds(),
                messageDTO.getSenderName(),
                messageDTO.getTimestamp()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMessage); // HTTP 201 반환
    }

    // roomId와 senderId를 기반으로 수신자 ID를 결정하는 메서드
    private List<String> determineRecipientIds(Long roomId, String senderId) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElse(null); // 채팅방 조회
        if (room != null) {
            // 발신자를 제외한 모든 멤버의 ID 반환
            return room.getMembers().stream()
                    .map(Member::getMid)
                    .filter(mid -> !mid.equals(senderId))
                    .collect(Collectors.toList());
        }
        return Collections.emptyList(); // 멤버가 없는 경우 빈 리스트 반환
    }

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<ChatRoomDTO> getChatRoomById(@PathVariable Long roomId) {
        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(roomId);

        // 채팅방이 존재하지 않을 경우 404 반환
        if (chatRoomOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        ChatRoom chatRoom = chatRoomOptional.get();

        // 채팅방 이름이 null 또는 빈 문자열이면 기본값 설정
        String roomName = (chatRoom.getRoomName() != null && !chatRoom.getRoomName().isEmpty())
                ? chatRoom.getRoomName()
                : "알 수 없는 채팅방";

        // ChatRoomDTO 생성
        ChatRoomDTO chatRoomDTO = new ChatRoomDTO(
                chatRoom.getId(),
                roomName, // 안전한 이름 전달
                chatRoom.getMembers().stream()
                        .map(Member::getMid)
                        .collect(Collectors.toSet())
        );

        return ResponseEntity.ok(chatRoomDTO); // 올바른 DTO 반환
    }

    // WebSocket 메시지 전송 - 실시간 채팅
    @MessageMapping("/chat.send/{roomId}")
    public void sendMessage(@DestinationVariable Long roomId, @Payload String messageJson) throws JsonProcessingException {
        log.info("Received raw JSON message: {}", messageJson);

        // 채팅방 존재 여부 확인
        if (!chatRoomRepository.existsById(roomId)) {
            log.warn("채팅방이 존재하지 않습니다: roomId = {}", roomId);

            // 에러 메시지 전송
            ChatMessageDTO errorResponse = ChatMessageDTO.builder()
                    .roomId(roomId)
                    .content("더 이상 채팅방이 존재하지 않습니다.")
                    .senderId("System")
                    .senderName("System")
                    .build();

            String errorJson = objectMapper.writeValueAsString(errorResponse);
            messagingTemplate.convertAndSend("/topic/rooms/" + roomId, errorJson); // 에러 메시지 전송
            return; // 메시지 처리를 중단
        }

        // JSON 메시지를 ChatMessageDTO로 변환
        ChatMessageDTO message = objectMapper.readValue(messageJson, ChatMessageDTO.class);
        log.info("Parsed ChatMessageDTO: {}", message);

        // 메시지 저장
        ChatMessageDTO savedMessage = chatRoomService.createMessage(
                message.getRoomId(),
                message.getContent(),
                message.getSenderId(),
                message.getRecipientIds(),
                message.getSenderName(),
                message.getTimestamp()
        );

        // WebSocket으로 전송
        String messageChat = objectMapper.writeValueAsString(savedMessage);
        String roomChannel = "/topic/rooms/" + message.getRoomId(); // 채팅방 전송 채널
        log.info("전송 중인 메시지: {}", messageChat);
        redisTemplate.convertAndSend("chatChannel", messageChat); // Redis Pub/Sub 사용
    }

    // WebSocket에서 사용자 추가 처리
    @MessageMapping("/chat.addUser")
    public void addUser(ChatMessageDTO message) {
        messagingTemplate.convertAndSend("/topic/rooms/" + message.getRoomId(), message); // WebSocket으로 사용자 추가 전송
    }
}
