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


}
