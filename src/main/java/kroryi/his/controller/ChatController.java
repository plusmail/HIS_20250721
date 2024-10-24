package kroryi.his.controller;

import kroryi.his.domain.Member;
import kroryi.his.dto.ChatMessageDTO;
import kroryi.his.dto.MemberJoinDTO;
import kroryi.his.dto.MessageDTO;
import kroryi.his.service.ChatRoomService;
import kroryi.his.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final MemberService memberService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomService chatRoomService;

    // 사용자 목록을 반환하는 API
    @GetMapping("/members")
    public ResponseEntity<List<MemberJoinDTO>> getAllMembers() {
        List<MemberJoinDTO> members = memberService.getAllUserIdAndName();
        List<MemberJoinDTO> memberJoinDTOs = members.stream()
                .map(member -> new MemberJoinDTO(member.getMid(), member.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(memberJoinDTOs);  // JSON으로 사용자 목록 반환
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