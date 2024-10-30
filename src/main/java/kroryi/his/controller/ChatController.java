package kroryi.his.controller;

import jakarta.servlet.http.HttpSession;
import kroryi.his.domain.Member;
import kroryi.his.dto.ChatMessageDTO;
import kroryi.his.dto.ChatRoomDTO;
import kroryi.his.dto.MemberJoinDTO;
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
import java.util.List;


@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Log4j2
public class ChatController {

    private final MemberService memberService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomService chatRoomService;

    @GetMapping("/auth/currentUser")
    public ResponseEntity<MemberJoinDTO> getCurrentUser() {
        log.info("Current user endpoint accessed");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserDetails currentUser = (UserDetails) authentication.getPrincipal();
        MemberJoinDTO memberDTO = new MemberJoinDTO(currentUser.getUsername(), currentUser.getAuthorities().toString());
        return ResponseEntity.ok(memberDTO);
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

        // 채팅방 생성 서비스 호출
        ChatRoomDTO createdRoom = chatRoomService.createChatRoom(chatRoomDTO.getRoomName(), memberMidsList);

        if (createdRoom.getId() == null) {
            log.error("채팅방 생성 실패 - 방 ID가 null입니다.");
            throw new IllegalStateException("채팅방 생성 실패 - 방 ID가 null입니다.");
        }

        log.info("채팅방 생성 성공 - 방 ID: {}", createdRoom.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdRoom);
    }

    // 채팅방 목록 반환
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomDTO>> getUserChatRooms(@AuthenticationPrincipal UserDetails userDetails) {
        String currentUserId = userDetails.getUsername(); // 현재 로그인된 사용자 ID 가져오기
        List<ChatRoomDTO> rooms = chatRoomService.getAllChatRoomsForUserWithLastMessage(currentUserId);
        return ResponseEntity.ok(rooms);
    }

    // ChatController에 사용자 목록 반환 엔드포인트 추가
    @GetMapping("/member/list")
    public ResponseEntity<List<MemberJoinDTO>> getAllMembers() {
        List<MemberJoinDTO> members = memberService.getAllMembers();
        return ResponseEntity.ok(members);
    }


    // 채팅방 메시지 가져오기
    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessageDTO>> getMessages(@PathVariable Long roomId) {
        List<ChatMessageDTO> messages = chatRoomService.getMessagesByRoomId(roomId);
        return ResponseEntity.ok(messages);
    }

    // 채팅 메시지 저장
    @PostMapping("/rooms/{roomId}/messages")
    public ResponseEntity<ChatMessageDTO> postMessage(
            @PathVariable Long roomId,
            @RequestBody ChatMessageDTO messageDTO) {
        messageDTO.setRoomId(roomId);
        ChatMessageDTO savedMessage = chatRoomService.saveMessage(roomId, messageDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMessage);
    }

    // WebSocket에서 메시지 전송 처리
    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageDTO message) {
        chatRoomService.sendMessageToRoom(message.getRoomId(), message);
        messagingTemplate.convertAndSend("/topic/rooms/" + message.getRoomId(), message);
    }

    // WebSocket에서 사용자 추가 처리
    @MessageMapping("/chat.addUser")
    public void addUser(ChatMessageDTO message) {
        messagingTemplate.convertAndSend("/topic/rooms/" + message.getRoomId(), message);
    }
}
