package kroryi.his.dto;

import lombok.Value;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for {@link kroryi.his.domain.PatientAdmission}
 */
@Value
public class PatientAdmissionDTO implements Serializable {
    Integer id;
    String paName;
    String mainDoc;
    LocalDate rvTime;
    LocalDate viTime;
    String treatStatus;
}