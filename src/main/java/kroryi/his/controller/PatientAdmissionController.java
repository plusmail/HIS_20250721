package kroryi.his.controller;

import kroryi.his.domain.PatientAdmission;
import kroryi.his.dto.PatientAdmissionDTO;
import kroryi.his.service.PatientAdmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/patient-admission")
public class PatientAdmissionController {

    @Autowired
    private PatientAdmissionService patientAdmissionService;

    @PostMapping("/register")
    public String registerPatient(@RequestBody PatientAdmissionDTO patientAdmissionDTO) {
        System.out.println("환자 등록 요청 수신:" + patientAdmissionDTO);

        // 현재 시간을 접수 시간으로 설정
        patientAdmissionDTO.setReceptionTime(LocalDateTime.now());
        patientAdmissionDTO.setTreatStatus("1"); // 대기 상태는 1

        // DB에 저장
        patientAdmissionService.savePatientAdmission(patientAdmissionDTO);

        return "환자가 대기 상태로 등록되었습니다.";
    }

    @GetMapping("/waiting")
    public List<PatientAdmission> getWaitingPatients() {
        // 대기 환자 목록 반환
        return patientAdmissionService.getWaitingPatients();
    }
}
