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
    public List<MaterialRegister> searchByName(String materialName) {
        return materialRepository.findBymaterialNameContainingIgnoreCase(materialName);
    }

    @Override
    public boolean isMaterialCodeDuplicate(String materialCode) {
        return materialRepository.existsByMaterialCode(materialCode);
    }

    @Override
    public void addMaterial(MaterialRegister register) {
        if (isMaterialCodeDuplicate(register.getMaterialCode())) {
            throw new IllegalArgumentException("중복된 회사 코드입니다.");
        }
        materialRepository.save(register);
    }

    @Override
    public void deleteMaterial(String materialCode) {
        materialRepository.deleteById(materialCode);
    }

    @Override
    public List<MaterialRegister> getAllMaterial() {
        return materialRepository.findAll();
    }

    @Override
    public MaterialRegister register(MaterialDTO materialDTO) {
        MaterialRegister materialRegister = modelMapper.map(materialDTO, MaterialRegister.class);

        return materialRepository.save(materialRegister);
    }

}

