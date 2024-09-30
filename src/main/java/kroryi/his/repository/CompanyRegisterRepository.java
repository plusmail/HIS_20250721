package kroryi.his.repository;

import kroryi.his.domain.CompanyRegister;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompanyRegisterRepository extends JpaRepository<CompanyRegister, String> {
    List<CompanyRegister> findByCompanyNameContainingIgnoreCase(String companyName);

    boolean existsByCompanyCode(String companyCode);

    CompanyRegister findByCompanyCode(String companyCode);
}
