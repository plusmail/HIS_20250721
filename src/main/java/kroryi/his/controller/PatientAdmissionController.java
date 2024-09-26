package kroryi.his.controller;

import kroryi.his.domain.PatientAdmission;
import kroryi.his.dto.PatientAdmissionDTO;
import kroryi.his.service.PatientAdmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PatientAdmissionController {

    @Autowired
    private PatientAdmissionService patientAdmissionService;

    @PostMapping("/saveCompletedData")
    public ResponseEntity<Map<String, Object>> saveCompletedData(@RequestBody List<PatientAdmissionDTO> completedData) {
        try {
            // 서비스 메소드를 호출하여 데이터 저장
            patientAdmissionService.saveCompletedData(completedData);

            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
