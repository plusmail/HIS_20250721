package kroryi.his.repository;

import kroryi.his.domain.CompanyRegister;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRegisterRepository extends JpaRepository<CompanyRegister, String> {
    // 회사 코드로 회사 찾기
    CompanyRegister findByCompanyCode(String companyCode);
}
