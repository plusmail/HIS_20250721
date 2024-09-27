package kroryi.his.dto;

import lombok.*;

import java.io.Serializable;

import java.time.LocalDateTime;

/**
 * DTO for {@link kroryi.his.domain.PatientAdmission}
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PatientAdmissionDTO implements Serializable {
    private Integer chartNum; //차트번호
    private String paName;  // 환자이름
    private String mainDoc;  // 의사이름
    private LocalDateTime receptionTime;  //접수시간
    private LocalDateTime appointmentTime; // 예약시간
    private LocalDateTime treatmentStartTime; // 진료시작시간
    private LocalDateTime completionTime;  // 완료시간
    private String treatStatus;
}