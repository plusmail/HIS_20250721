package kroryi.his.repository;

import kroryi.his.domain.CompanyRegister;
import kroryi.his.domain.MaterialRegister;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaterialRegisterRepository extends JpaRepository<MaterialRegister, String> {
    List<MaterialRegister> findBymaterialNameContainingIgnoreCase(String materialName);

    boolean existsByMaterialCode(String materialCode);
}
