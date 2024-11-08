package kroryi.his.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class MedicalChartSearchDTO {
    private LocalDate mdTimeStart;
    private LocalDate mdTimeEnd;
    private String checkDoc;
    private String medicalDivision;
    private List<String> teethNum;  // 배열로 수정
    private String chartNum;
    private String keyword;  // keyword 필드 추가
}
