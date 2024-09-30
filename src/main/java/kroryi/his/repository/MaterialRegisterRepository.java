package kroryi.his.repository;

import kroryi.his.domain.CompanyRegister;
import kroryi.his.domain.MaterialRegister;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MaterialRegisterRepository extends JpaRepository<MaterialRegister, String> {
    @Query("SELECT m FROM MaterialRegister m JOIN FETCH m.companyRegister")
    List<MaterialRegister> findByMaterialNameContainingIgnoreCase(String materialName);

    boolean existsByMaterialCode(String materialCode);

}
