package kroryi.his.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Getter
@Setter
@Table(name = "company")
public class CompanyRegister {

    //material 테이블과 일대다 관계 (FK = companyCode)
    @OneToMany(mappedBy = "companyRegister",cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @ToString.Exclude
    private List<MaterialRegister> materialList = new ArrayList<>();

    //업체코드
    @Id
    @Column(name = "company_code", nullable = false, length = 30)
    private String companyCode;

    //업체명
    @Column(name = "company_Name", nullable = false,length = 20)
    private String companyName;


    //사업자등록번호
    @Column(name = "business_Number", nullable = false,length = 20)
    private String businessNumber;

    //업체전화번호
    @Column(name = "company_Number", length = 20)
    private String companyNumber;

    //업체담당자명
    @Column(name = "manager_Name", length = 10)
    private String managerName;

    //담당자연락처
    @Column(name = "manager_Number", length = 15)
    private String managerNumber;

    //업체메모
    @Column(name = "company_Memo", length = 100)
    private String companyMemo;

}
