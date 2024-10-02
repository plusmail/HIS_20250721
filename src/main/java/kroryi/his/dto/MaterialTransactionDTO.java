package kroryi.his.dto;

import kroryi.his.domain.MaterialRegister;
import kroryi.his.domain.MaterialTransactionRegister;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MaterialTransactionDTO {

    //입출아이디
    private Long transactionId;

    //입출일자
    private LocalDate transactionDate;

    //입고량
    private Long stockIn;

    //출고량
    private Long stockOut;

    //잔량
    private Long remainingStock;

    //안전재고량미달품목
    private boolean belowSafetyStock;

    //재료명
    private String materialName;

    //재료코드
    private String materialCode;

    //업체코드
    private String companyCode;

    //업체명
    private String companyName;

    //담당자연락처
    private String managerNumber;

    public MaterialTransactionDTO(MaterialTransactionRegister MaterialTransactionRegister) {
        this.transactionId = MaterialTransactionRegister.getTransactionId();
        this.transactionDate = MaterialTransactionRegister.getTransactionDate();
        this.stockIn = MaterialTransactionRegister.getStockIn();
        this.stockOut = MaterialTransactionRegister.getStockOut();
        this.remainingStock = MaterialTransactionRegister.getRemainingStock();
        this.belowSafetyStock = MaterialTransactionRegister.isBelowSafetyStock();
        this.materialCode = MaterialTransactionRegister.getMaterialRegister().getMaterialCode();
        this.materialName = MaterialTransactionRegister.getMaterialRegister().getMaterialName();
        this.companyName = MaterialTransactionRegister.getMaterialRegister().getCompanyRegister().getCompanyName();
        this.companyCode = MaterialTransactionRegister.getMaterialRegister().getCompanyRegister().getCompanyCode();
        this.managerNumber = MaterialTransactionRegister.getMaterialRegister().getCompanyRegister().getManagerNumber();

    }

}
