package kroryi.his.controller;


import kroryi.his.dto.ChatMessageDTO;
import kroryi.his.dto.ChatRoomDTO;
import kroryi.his.service.ChatRoomService;
import kroryi.his.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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

    @PostMapping("/rooms")
    public ResponseEntity<ChatRoomDTO> createChatRoom(@RequestBody ChatRoomDTO chatRoomDTO) {
        // Set<String>을 List<String>으로 변환
        List<String> memberNamesList = new ArrayList<>(chatRoomDTO.getMemberNames());

        // 변환된 List를 사용하여 채팅방 생성
        ChatRoomDTO createdRoom = chatRoomService.createChatRoom(chatRoomDTO.getRoomName(), memberNamesList);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRoom);
    }

    // 채팅방 목록 반환
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomDTO>> getAllChatRooms() {
        List<ChatRoomDTO> rooms = chatRoomService.getAllChatRooms();
        return ResponseEntity.ok(rooms);
    }

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageDTO message) {
        chatRoomService.sendMessageToRoom(message.getRoomId(), message);
        messagingTemplate.convertAndSend("/topic/rooms/" + message.getRoomId(), message);
    }

    @MessageMapping("/chat.addUser")
    public void addUser(ChatMessageDTO message) {
        messagingTemplate.convertAndSend("/topic/rooms/" + message.getRoomId(), message);
    }
}