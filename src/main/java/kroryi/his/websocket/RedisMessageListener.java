package kroryi.his.websocket;

import lombok.extern.log4j.Log4j2;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class RedisMessageListener {

    private final SimpMessagingTemplate messagingTemplate;

    public RedisMessageListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void receiveMessage(String message) {
        // /topic/patientUpdates 채널로 WebSocket 메시지 전송

        log.info("받은 메세지......receive message: " + message);
        messagingTemplate.convertAndSend("/topic/patientUpdates", message);
    }
}