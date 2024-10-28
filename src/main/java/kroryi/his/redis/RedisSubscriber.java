package kroryi.his.redis;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class RedisSubscriber {


    private final SimpMessagingTemplate messagingTemplate;

    // 메시지를 수신했을 때 WebSocket으로 클라이언트에 전송
    public void onMessage(String message) {
        messagingTemplate.convertAndSend("/topic/admission", message);
    }
}