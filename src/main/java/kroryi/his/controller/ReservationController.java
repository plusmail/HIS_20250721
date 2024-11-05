package kroryi.his.controller;

import kroryi.his.domain.PatientStatusDTO;
import kroryi.his.service.PatientRegisterService;
import kroryi.his.service.ReservationRegisterService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Log4j2
@Controller
public class ReservationController {

    @Autowired
    private PatientRegisterService patientRegisterService;

    @Autowired
    private ReservationRegisterService reservationRegisterService;


    @GetMapping("/reservation_view")
    public String getReservationView() {
            return "reservation_view";
    }

    @GetMapping("/reservation_register")
    public String getReservationRegister(Model model) {
        // 데이터를 추가하여 렌더링
                List<String> doctorNames = patientRegisterService.getDoctorNames();
        model.addAttribute("doctorNames", doctorNames); // 의사 이름을 모델에 추가
        log.info("doctorNames!!!!!!!!!!"+doctorNames);
        return "reservation_register";
    }

    @GetMapping("/api/patient-status")
    public ResponseEntity<PatientStatusDTO> getPatientStatus() {
        try {
            int generalPatientCount = reservationRegisterService.getGeneralPatientCount();
            int surgeryCount = reservationRegisterService.getSurgeryCount();
            int newPatientCount = reservationRegisterService.getNewPatientCount();

            PatientStatusDTO patientStatus = new PatientStatusDTO(generalPatientCount, surgeryCount, newPatientCount);
            return ResponseEntity.ok(patientStatus);
        } catch (Exception e) {
            log.error("Error fetching patient status", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


}
