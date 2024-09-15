package kroryi.his.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompanyDTO {
    private String companyCode;
    private String companyName;
    private String businessNumber;
    private String companyNumber;
    private String managerName;
    private String managerNumber;
    private String companyMemo;
}
