package kroryi.his.dto;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for {@link kroryi.his.domain.PatientAdmission}
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PatientAdmissionDTO implements Serializable {
    private Integer id;
    private String paName;
    private String mainDoc;
    private LocalDate rvTime;
    private LocalDate viTime;
    private String treatStatus;
}