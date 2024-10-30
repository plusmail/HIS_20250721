package kroryi.his.controller;


import kroryi.his.websocket.MessageRequest;
import kroryi.his.websocket.RedisPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Log4j2
public class PatientCountController {

    private final RedisPublisher redisPublisher;

    private final SimpMessagingTemplate sendingOperations;
    private final RedisTemplate<String, Object> redisTemplate;

//    @MessageMapping("/admission")
//    @SendTo("/topic/admission")
    public void enter(MessageRequest message) throws Exception {
        log.info("Message----> {},{}.{}"
                , message.getStatus1()
                , message.getStatus2()
                , message.getStatus3()
        );

        redisPublisher.publish("admission", message);
//        redisTemplate.convertAndSend("admission", message);
    }
}
