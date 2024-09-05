package kroryi.his.dto;

import lombok.Value;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for {@link kroryi.his.domain.MedicalChart}
 */
@Value
public class MedicalChartDTO implements Serializable {
    Integer id;
    String paName;
    LocalDate mdTime;
    String medicalDivision;
    String teethNum;
    String medicalContent;
}