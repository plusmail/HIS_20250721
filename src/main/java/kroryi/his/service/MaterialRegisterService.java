package kroryi.his.service;

import kroryi.his.domain.MaterialRegister;
import kroryi.his.dto.MaterialDTO;

import java.util.List;

public interface MaterialRegisterService {
    List<MaterialRegister> getAllMaterial();

    MaterialRegister register(MaterialDTO materialDTO);

    boolean isMaterialCodeDuplicate(String materialCode);

    List<MaterialRegister> searchByName(String materialName);

    void customDeleteByMaterialCode(String materialCode);

    List<MaterialRegister> searchByCompanyName(String companyName);

    List<MaterialRegister> searchByMaterialName(String materialName);

    List<MaterialRegister> searchByCompanyNameAndMaterialName(String companyName, String materialName);

    List<MaterialRegister> getAllMaterials();

    List<MaterialRegister> searchByParams(String materialName, String companyName);

    void updateMaterial(MaterialDTO materialDTO);
}
