package kroryi.his.websocket;

import kroryi.his.service.PatientAdmissionService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Component
public class PatientCountScheduler {
//    private final SimpMessagingTemplate messagingTemplate;
//    private final PatientAdmissionService patientAdmissionService;
//
//    public PatientCountScheduler(SimpMessagingTemplate messagingTemplate, PatientAdmissionService patientAdmissionService) {
//        this.messagingTemplate = messagingTemplate;
//        this.patientAdmissionService = patientAdmissionService;
//    }
//
//    @EventListener
//    public void handlePatientAdmissionEvent(PatientAdmissionEvent event) {
//        // 이벤트 처리: 환자 수 업데이트 로직 추가
//        sendPatientCounts();
//    }

//    @Scheduled(fixedRate = 2000)
//    public void sendPatientCounts() {
//
//        System.out.println("8888888888888888->" + LocalDate.now());
//        LocalDate today = LocalDate.now();
//        for (String status : Arrays.asList("1", "2", "3")) {
//            long count = patientAdmissionService.getCompleteTreatmentCount(status, today);
//            Map<String, Object> patientCountUpdate = new HashMap<>();
//            patientCountUpdate.put("status", status);
//            patientCountUpdate.put("count", count);
//
//            messagingTemplate.convertAndSend("/topic/patientCount", patientCountUpdate);
//        }
//    }
}
