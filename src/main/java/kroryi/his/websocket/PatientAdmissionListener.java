package kroryi.his.websocket;

import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import kroryi.his.domain.PatientAdmission;
import kroryi.his.service.PatientAdmissionService;
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

@Component
public class PatientAdmissionListener  implements ApplicationListener<PatientAdmissionEvent> {
    private final SimpMessagingTemplate messagingTemplate;
    private final PatientAdmissionService patientAdmissionService;

    @Autowired
    public PatientAdmissionListener(SimpMessagingTemplate messagingTemplate, PatientAdmissionService patientAdmissionService) {
        this.messagingTemplate = messagingTemplate;
        this.patientAdmissionService = patientAdmissionService;
    }

    private void sendPatientCounts(Long patientId) {
        for (String status : Arrays.asList("1", "2", "3")) {
            long count = patientAdmissionService.getCompleteTreatmentCount(status, LocalDate.now());
            Map<String, Object> patientCountUpdate = new HashMap<>();
            patientCountUpdate.put("status", status);
            patientCountUpdate.put("count", count);

            messagingTemplate.convertAndSend("/topic/patientCount", patientCountUpdate); // 메시지 전송
        }
    }

    @Override
    public void onApplicationEvent(PatientAdmissionEvent event) {
        // 환자 수 업데이트 로직
        System.out.println("9999999999999999999->" + event);
        sendPatientCounts(event.getPatientId());
    }
//    @PostPersist
//    @PostUpdate
//    @PostRemove
//    public void handlePatientAdmissionChange(PatientAdmission patientAdmission) {
//        System.out.println("4444444444444->" + patientAdmission);
//        patientCountScheduler.sendPatientCounts();
//    }
}