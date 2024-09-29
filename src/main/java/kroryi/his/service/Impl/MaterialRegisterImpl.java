package kroryi.his.service.Impl;

import kroryi.his.domain.CompanyRegister;
import kroryi.his.domain.MaterialRegister;
import kroryi.his.dto.MaterialDTO;
import kroryi.his.repository.MaterialRegisterRepository;
import kroryi.his.service.MaterialRegisterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Log4j2
@Service
public class MaterialRegisterImpl implements MaterialRegisterService {

    private final MaterialRegisterRepository materialRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<MaterialRegister> getAllMaterial() {
        return materialRepository.findAll();
    }

    @Override
    public boolean isMaterialCodeDuplicate(String materialCode) {
        return materialRepository.existsByMaterialCode(materialCode);
    }

    @Override
    public MaterialRegister register(MaterialDTO materialDTO) {
        MaterialRegister materialRegister = modelMapper.map(materialDTO, MaterialRegister.class);

        return materialRepository.save(materialRegister);
    }

    @Override
    public List<MaterialRegister> searchByName(String materialName) {
        return materialRepository.findByMaterialNameContainingIgnoreCase(materialName);
    }

    // 재료 삭제
    @Override
    public void deleteMaterial(String materialCode) {
        materialRepository.deleteById(materialCode);
    }

}

