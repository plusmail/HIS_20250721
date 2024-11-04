package kroryi.his.controller;

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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


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
        String currentUserId = userDetails.getUsername(); // 현재 로그인된 사용자 ID를 가져옴
        List<String> memberMidsList = new ArrayList<>(chatRoomDTO.getMemberMids());

        // 현재 사용자가 채팅방에 포함되지 않으면 추가
        if (!memberMidsList.contains(currentUserId)) {
            memberMidsList.add(currentUserId);
        }

        // recipientId를 두 번째 사용자로 설정
        String recipientId = memberMidsList.size() > 1 ? memberMidsList.get(1) : null;

        // 채팅방 생성 서비스 호출
        ChatRoomDTO createdRoom = chatRoomService.createChatRoom(chatRoomDTO.getRoomName(), memberMidsList, recipientId);

        if (createdRoom.getId() == null) {
            log.error("채팅방 생성 실패 - 방 ID가 null입니다.");
            throw new IllegalStateException("채팅방 생성 실패 - 방 ID가 null입니다.");
        }

        log.info("채팅방 생성 성공 - 방 ID: {}", createdRoom.getId());

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
        if (messageDTO.getRecipientId() == null) {
            String recipientId = determineRecipientId(roomId, messageDTO.getSenderId());
            messageDTO.setRecipientId(recipientId);
        }

        log.info("Sending message from senderId: {} to recipientId: {}", messageDTO.getSenderId(), messageDTO.getRecipientId());

        ChatMessageDTO savedMessage = chatRoomService.createMessage(
                roomId,
                messageDTO.getContent(),
                messageDTO.getSenderId(),
                messageDTO.getRecipientId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMessage);
    }

    // roomId와 senderId를 기반으로 수신자 ID를 결정하는 메서드
    private String determineRecipientId(Long roomId, String senderId) {
        // 로직: 채팅방의 멤버 중 senderId가 아닌 다른 사용자 찾기
        ChatRoom room = chatRoomRepository.findById(roomId).orElse(null);
        if (room != null) {
            for (Member member : room.getMembers()) {
                if (!member.getMid().equals(senderId)) {
                    return member.getMid();  // sender가 아닌 다른 멤버의 ID 반환
                }
            }
        }
        return null;  // 기본 수신자가 없으면 null 반환
    }

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageDTO message) {
        ChatMessageDTO savedMessage = chatRoomService.createMessage(
                message.getRoomId(),
                message.getContent(),
                message.getSenderId(),
                message.getRecipientId()
        );

        // 채팅방 구독자에게 메시지 전송
        messagingTemplate.convertAndSend("/topic/rooms/" + message.getRoomId(), savedMessage);
    }


    // WebSocket에서 사용자 추가 처리
    @MessageMapping("/chat.addUser")
    public void addUser(ChatMessageDTO message) {
        messagingTemplate.convertAndSend("/topic/rooms/" + message.getRoomId(), message);
    }
}
