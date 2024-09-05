package kroryi.his.dto;

import lombok.Value;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for {@link kroryi.his.domain.PatientAppointment}
 */
@Value
public class PatientAppointmentDTO implements Serializable {
    Integer id;
    LocalDate reservationDate;
    String rvType;
    String paName;
    String mainDoc;
    String dentalHygienist;
    LocalDate rvTime;
    LocalDate mdTime;
    String medicalType;
    String paInfo;
    String notice;
    String rvNon;
    String rvInfo;
    LocalDate lastReserv;
    LocalDate firstVisit;
    LocalDate lastVisit;
}