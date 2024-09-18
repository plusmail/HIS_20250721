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

    //업체코드
    private String companyCode;

    //업체명
    private String companyName;

    //사업자등록번호
    private String businessNumber;

    //업체전화번호
    private String companyNumber;

    //업체담당자명
    private String managerName;

    //담당자연락처
    private String managerNumber;

    //업체메모
    private String companyMemo;
}
