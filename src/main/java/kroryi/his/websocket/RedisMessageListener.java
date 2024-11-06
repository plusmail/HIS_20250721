package kroryi.his.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import kroryi.his.dto.ChatMessageDTO;
import lombok.extern.log4j.Log4j2;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class RedisMessageListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    public RedisMessageListener(SimpMessagingTemplate messagingTemplate, ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
    }

    public void receiveMessage(String message) {
        // /topic/patientUpdates 채널로 WebSocket 메시지 전송

        log.info("받은 메세지......receive message: " + message);
        messagingTemplate.convertAndSend("/topic/patientUpdates", message);
    }

    public void receiveChatMessage(String message) {
        // /topic/patientUpdates 채널로 WebSocket 메시지 전송
        try {
            // 메시지 내용을 JSON으로 변환하여 roomId를 포함시킴
            ChatMessageDTO chatMessage = objectMapper.readValue(message, ChatMessageDTO.class);

            // roomId를 사용해 전송 경로 설정
            String roomChannel = "/topic/rooms/" + chatMessage.getRoomId();

            log.info("받은 메세지... Room ID: {}, 메시지 내용: {}", chatMessage.getRoomId(), message);

            // 특정 roomId 경로로 메시지 전송
            log.info("받은 메세지......receive Chat message: {}", message);
            messagingTemplate.convertAndSend(roomChannel, message);
        } catch (JsonProcessingException e) {
            log.error("메시지 변환 중 오류 발생:", e);
        }
    }

    public void receiveReservationMessage(String message) {
        // /topic/patientUpdates 채널로 WebSocket 메시지 전송

        log.info("예약 등록메세지......receive Reservation message: {}", message);
        messagingTemplate.convertAndSend("/topic/patientCounts", message);
    }
}