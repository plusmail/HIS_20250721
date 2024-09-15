package kroryi.his.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Getter
@Setter
@Table(name = "company")
public class CompanyRegister {

    //업체코드
    @Id
    @Column(name = "companyCode", nullable = false, length = 30)
    private String companyCode;

    //업체명
    @Column(name = "companyName", nullable = false,length = 20)
    private String companyName;

    //사업자등록번호
    @Column(name = "businessNumber", nullable = false,length = 20)
    private String businessNumber;

    //업체전화번호
    @Column(name = "companyNumber", length = 20)
    private String companyNumber;

    //업체담당자명
    @Column(name = "managerName", length = 10)
    private String managerName;

    //담당자연락처
    @Column(name = "managerNumber", length = 15)
    private String managerNumber;

    //업체메모
    @Column(name = "companyMemo", length = 100)
    private String companyMemo;

}
