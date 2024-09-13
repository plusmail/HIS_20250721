package kroryi.his.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PatientMemoDTO {

    // 메모 ID
    private Long mmo;

    // 차트번호
    @NotNull
    private String memoChartnum;

    // 내용
    @NotEmpty
    private String content;

    // 등록 날짜
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime regDate;


}
