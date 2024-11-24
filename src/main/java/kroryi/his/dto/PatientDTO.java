package kroryi.his.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientDTO{
    private String chartNum;
    private String name;
    private String firstPaResidentNum;
    private String lastPaResidentNum;
    private String gender;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate birthDate;

    private String homeNum;
    private String phoneNum;
    private String email;
    private String defaultAddress;
    private String detailedAddress;
    private String mainDoc;
    private String visitPath;
    private String category;
    private String tendency;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate firstVisit;

    private List<PatientMemoDTO> memos;
}