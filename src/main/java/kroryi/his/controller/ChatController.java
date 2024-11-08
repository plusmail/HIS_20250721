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

    @GetMapping("/auth/currentUser")
    public ResponseEntity<MemberJoinDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        MemberSecurityDTO currentUser = (MemberSecurityDTO) authentication.getPrincipal();
        return ResponseEntity.ok(new MemberJoinDTO(currentUser.getUsername(), currentUser.getName()));
    }

    // 채팅방 생성
    @PostMapping("/rooms")
    public ResponseEntity<ChatRoomDTO> createChatRoom(@RequestBody ChatRoomDTO chatRoomDTO, @AuthenticationPrincipal UserDetails userDetails) {
        String currentUserId = userDetails.getUsername();
        List<String> memberMidsList = new ArrayList<>(chatRoomDTO.getMemberMids());

        log.info("채팅방 생성 요청: 방 이름 = {}, 멤버 = {}", chatRoomDTO.getRoomName(), memberMidsList);

        // 채팅방에 현재 사용자가 포함되지 않았다면 추가
        if (!memberMidsList.contains(currentUserId)) {
            memberMidsList.add(currentUserId);
            log.info("현재 사용자({})가 멤버 목록에 추가됨", currentUserId);
        }

        // 다인 채팅을 위해 recipientIds를 전체 멤버로 설정
        List<String> recipientIds = memberMidsList.size() > 1 ? memberMidsList : null;
        log.info("최종 멤버 목록: {}, 수신자 목록: {}", memberMidsList, recipientIds);

        // 채팅방 생성
        ChatRoomDTO createdRoom = chatRoomService.createChatRoom(chatRoomDTO.getRoomName(), memberMidsList, recipientIds);
        log.info("채팅방 생성 완료: 채팅방 ID = {}, 방 이름 = {}, 멤버 = {}", createdRoom.getId(), createdRoom.getRoomName(), createdRoom.getMemberMids());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdRoom);
    }

    // 채팅방 목록 반환
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomDTO>> getUserChatRooms() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String currentUserId = ((UserDetails) authentication.getPrincipal()).getUsername(); // 현재 로그인된 사용자 ID 가져오기
        List<ChatRoomDTO> rooms = chatRoomService.getAllChatRoomsForUserWithLastMessage(currentUserId);
        return ResponseEntity.ok(rooms);
    }

    @PostMapping("/private-room")
    public ResponseEntity<ChatRoomDTO> createOrGetPrivateChatRoom(@RequestParam String member1Mid,
                                                                  @RequestParam String member2Mid) {
        ChatRoomDTO chatRoom = chatRoomService.createOrGetPrivateChatRoom(member1Mid, member2Mid);
        return ResponseEntity.ok(chatRoom);
    }


    // ChatController에 사용자 목록 반환 엔드포인트 추가
    @GetMapping("/member/list")
    public ResponseEntity<List<MemberJoinDTO>> getAllMembers() {
        List<MemberJoinDTO> members = memberService.getMembers();
        return ResponseEntity.ok(members);
    }


    // 채팅방 메시지 가져오기
    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessageDTO>> getMessages(@PathVariable Long roomId) {
        List<ChatMessageDTO> messages = chatRoomService.getMessagesByRoomId(roomId);
        return ResponseEntity.ok(messages);
    }


    // 선택한 채팅방 삭제
    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<Void> deleteChatRoom(@PathVariable Long roomId) {
        chatRoomService.deleteChatRoom(roomId);
        return ResponseEntity.noContent().build();
    }

    // 채팅 메시지 저장
    @PostMapping("/rooms/{roomId}/messages")
    public ResponseEntity<ChatMessageDTO> postMessage(
            @PathVariable Long roomId,
            @RequestBody ChatMessageDTO messageDTO) {
        messageDTO.setRoomId(roomId);

        // 수신자가 지정되지 않은 경우 기본 수신자를 설정
        if (messageDTO.getRecipientIds() == null) {
            List<String> recipientIds = determineRecipientIds(roomId, messageDTO.getSenderId());
            messageDTO.setRecipientIds(recipientIds); // List<String>으로 설정
        }

        log.info("Sending message from senderId: {} to recipientIds: {}", messageDTO.getSenderId(), messageDTO.getRecipientIds());

        ChatMessageDTO savedMessage = chatRoomService.createMessage(
                roomId,
                messageDTO.getContent(),
                messageDTO.getSenderId(),
                messageDTO.getRecipientIds(),
                messageDTO.getSenderName(),
                messageDTO.getTimestamp()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMessage);
    }

    // roomId와 senderId를 기반으로 수신자 ID를 결정하는 메서드
    private List<String> determineRecipientIds(Long roomId, String senderId) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElse(null);
        if (room != null) {
            return room.getMembers().stream()
                    .map(Member::getMid)
                    .filter(mid -> !mid.equals(senderId)) // senderId가 아닌 모든 멤버의 ID
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();  // 기본 수신자가 없을 경우 빈 리스트 반환
    }

    // WebSocket 메시지 전송 메서드 - 다중 및 1:1 채팅 지원
    @MessageMapping("/chat.send/{roomId}")
    public void sendMessage(@Payload String messageJson) throws JsonProcessingException {
        log.info("Received raw JSON message: {}", messageJson);

        // JSON을 ChatMessageDTO로 변환
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

        // 메시지를 JSON으로 변환 후 WebSocket으로 전송
        String messageChat = objectMapper.writeValueAsString(savedMessage);
        String roomChannel = "/topic/rooms/" + message.getRoomId();
        log.info("전송 중인 메시지: {}", messageChat);
        redisTemplate.convertAndSend("chatChannel", messageChat);
    }

    // WebSocket에서 사용자 추가 처리
    @MessageMapping("/chat.addUser")
    public void addUser(ChatMessageDTO message) {
        messagingTemplate.convertAndSend("/topic/rooms/" + message.getRoomId(), message);
    }
}
