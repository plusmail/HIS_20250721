package kroryi.his.websocket;

import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import kroryi.his.domain.PatientAdmission;
import kroryi.his.service.PatientAdmissionService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.context.ApplicationEventPublisher;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Log4j2
@Component
public class PatientAdmissionListener {

    private static SimpMessagingTemplate messagingTemplate;

    @Autowired
    public void init(SimpMessagingTemplate template) {
        PatientAdmissionListener.messagingTemplate = template;
    }

    @PostPersist
    @PostRemove
    @PostUpdate
    public void onPostPersist(PatientAdmission admission) {
        // 데이터 등록 후 WebSocket으로 메시지 전송
        log.info("1111111111");
        messagingTemplate.convertAndSend("/topic/admission", "새로운 입원 등록: " + admission.getPid());
    }
}