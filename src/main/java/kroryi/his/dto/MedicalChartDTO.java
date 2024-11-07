package kroryi.his.dto;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO for {@link kroryi.his.domain.MedicalChart}
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MedicalChartDTO implements Serializable {
    private Integer cnum;
    private String paName;
    private LocalDate mdTime;
    private String medicalDivision;
    private String teethNum;
    private String medicalContent;
    private String checkDoc;
    private String chartNum;


    private List<List<String>> chartData;

}