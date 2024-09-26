package kroryi.his.dto;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for {@link kroryi.his.domain.PatientAdmission}
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PatientAdmissionDTO implements Serializable {
    private Integer chartNum;
    private String paName;
    private String mainDoc;
    private LocalDateTime receptionTime;
    private LocalDateTime completionTime;
//    private String treatStatus;
}