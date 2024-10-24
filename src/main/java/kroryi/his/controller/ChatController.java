package kroryi.his.controller;

import kroryi.his.dto.ChatMessageDTO;
import kroryi.his.dto.MessageDTO;
import kroryi.his.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomService chatRoomService;

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageDTO message) {
        // 채팅방에 메시지 저장
        chatRoomService.sendMessageToRoom(message.getRoomId(), message);

        // 모든 사용자에게 메시지를 브로드캐스트
        messagingTemplate.convertAndSend("/topic/rooms/" + message.getRoomId(), message);
    }

    @MessageMapping("/chat.addUser")
    public void addUser(ChatMessageDTO message) {
        // 사용자 추가 및 브로드캐스트
        messagingTemplate.convertAndSend("/topic/rooms/" + message.getRoomId(), message);
    }

}
