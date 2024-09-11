package kroryi.his.dto;

import lombok.Value;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for {@link kroryi.his.domain.Patient}
 */
@Value
public class PatientDTO implements Serializable {
    Integer id;
    String paPhoto;
    String paForeignCheck;
    String paName;
    String firstPaResidentNum;
    String lastPaResidentNum;
    String paGender;
    String paPhoneNum;
    String paEmail;
    String mainDoc;
    String visitPath;
    String paCategory;
    String paTendency;
    LocalDate firstVisit;
    LocalDate lastVisit;
}