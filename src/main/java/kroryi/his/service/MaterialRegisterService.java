package kroryi.his.service;

import kroryi.his.domain.CompanyRegister;
import kroryi.his.domain.MaterialRegister;
import kroryi.his.dto.MaterialDTO;

import java.util.List;

public interface MaterialRegisterService {
    List<MaterialRegister> getAllMaterial();

    MaterialRegister register(MaterialDTO materialDTO);

    boolean isMaterialCodeDuplicate(String materialCode);

    List<MaterialRegister> searchByName(String materialName);

    void deleteMaterial(String materialCode);
}
