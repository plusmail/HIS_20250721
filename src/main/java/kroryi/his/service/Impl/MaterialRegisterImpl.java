package kroryi.his.service.Impl;

import kroryi.his.domain.CompanyRegister;
import kroryi.his.domain.MaterialRegister;
import kroryi.his.dto.MaterialDTO;
import kroryi.his.repository.CompanyRegisterRepository;
import kroryi.his.repository.MaterialRegisterRepository;
import kroryi.his.service.MaterialRegisterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Log4j2
@Service
public class MaterialRegisterImpl implements MaterialRegisterService {

    private final MaterialRegisterRepository materialRepository;
    private final CompanyRegisterRepository companyRepository;
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
        // CompanyRegister 조회
        CompanyRegister companyRegister = companyRepository.findByCompanyCode(materialDTO.getCompanyCode());

        // CompanyRegister가 존재하지 않으면 예외 처리 (optional)
        if (companyRegister == null) {
            throw new IllegalArgumentException("Company with code " + materialDTO.getCompanyCode() + " does not exist.");
        }

        // MaterialDTO를 MaterialRegister로 변환
        MaterialRegister materialRegister = modelMapper.map(materialDTO, MaterialRegister.class);

        // CompanyRegister 설정
        materialRegister.setCompanyRegister(companyRegister);

        return materialRepository.save(materialRegister);
    }

    @Override
    public List<MaterialRegister> searchByName(String materialName) {
        return materialRepository.findByMaterialNameContainingIgnoreCase(materialName);
    }


    // 재료 삭제
    @Override
    @Transactional
    public void customDeleteByMaterialCode(String materialCode) {
        if (!materialRepository.existsByMaterialCode(materialCode)) {
            throw new IllegalArgumentException("존재하지 않는 재료 코드입니다: " + materialCode);
        }
        materialRepository.customDeleteByMaterialCode(materialCode);
    }

}

