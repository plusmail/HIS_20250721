package kroryi.his.controller;


import kroryi.his.domain.PatientAdmission;
import kroryi.his.repository.PatientAdmissionRepository;
import kroryi.his.service.PatientAdmissionService;
import kroryi.his.websocket.MessageRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
public class PatientCountController {

    private final SimpMessagingTemplate sendingOperations;

    @MessageMapping("/admission")
    public void enter(MessageRequest message) throws Exception {
        sendingOperations.convertAndSend("/topic/admission/" + message.getMarketId(), message);
        log.info("Message----> {}", message.getAmount());

    }
}

