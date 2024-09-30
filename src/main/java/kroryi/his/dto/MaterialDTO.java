package kroryi.his.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MaterialDTO {

    //재료명
    private String materialName;

    //재료코드
    private String materialCode;

    //단위
    private String materialUnit;

    //단가
    private Long materialUnitPrice;

    //최소보관수량
    private Long minQuantity;

    //재고관리여부
    private boolean stockManagementItem;

    //최초등록일
    private LocalDate firstRegisterDate;

    //업체코드
    private String companyCode;

    //업체명
    private String companyName;

}
