package kroryi.his.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Getter
@Setter
@Table(name = "materials")
public class MaterialRegister {
    @OneToMany(mappedBy = "materialRegister", cascade = CascadeType.ALL)
    private List<MaterialTransactionRegister> materialTransactionList = new ArrayList<>();

    //company의 업체코드와 join
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "company_Code")
    private CompanyRegister companyRegister;

    //재료명
    @Column(name = "material_Name", nullable = false,length = 30)
    private String materialName;

    //재료코드
    @Id
    @Column(name = "material_Code", nullable = false, length = 30)
    private String materialCode;

    //단위
    @Column(name = "material_Unit", nullable = false,length = 20)
    private String materialUnit;

    //단가
    @Column(name = "material_Unit_Price", nullable = false)
    private Long materialUnitPrice;

    //최소보관수량
    @Column(name = "min_Quantity", nullable = false)
    private Long minQuantity;

    //재고관리여부
    @Column(name = "stock_Management_Item", nullable = false)
    private boolean stockManagementItem;

    //최초등록일
    @Column(name = "first_Register_Date")
    private LocalDate firstRegisterDate;



}
