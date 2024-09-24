package kroryi.his.service;

import kroryi.his.domain.MaterialRegister;
import kroryi.his.dto.MaterialDTO;

import java.util.List;

public interface MaterialRegisterService {
    MaterialRegister register(MaterialDTO materialDTO);

    List<MaterialRegister> searchByName(String materialName);

    boolean isMaterialCodeDuplicate(String materialCode);

    void addMaterial(MaterialRegister register);

    void deleteMaterial(String materialCode);

    List<MaterialRegister> getAllMaterial();


}
