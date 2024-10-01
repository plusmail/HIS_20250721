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

import java.util.Collections;
import java.util.List;
import java.util.Optional;

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

        // 중복된 재료 코드가 있으면 예외 처리
        if (materialRepository.existsByMaterialCode(materialDTO.getMaterialCode())) {
            throw new IllegalArgumentException("Material with code " + materialDTO.getMaterialCode() + " already exists.");
        }

        // MaterialDTO를 MaterialRegister로 변환하여 신규 등록
        MaterialRegister materialRegister = modelMapper.map(materialDTO, MaterialRegister.class);
        materialRegister.setCompanyRegister(companyRegister);

        return materialRepository.save(materialRegister);  // 새로운 재료 등록
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


    // 업체명으로 검색
    public List<MaterialRegister> searchByCompanyName(String companyName) {
        return materialRepository.findByCompanyRegisterCompanyNameContaining(companyName);
    }

    // 재료명으로 검색
    public List<MaterialRegister> searchByMaterialName(String materialName) {
        return materialRepository.findByMaterialNameContaining(materialName);
    }

    // 업체명과 재료명으로 검색
    public List<MaterialRegister> searchByCompanyNameAndMaterialName(String companyName, String materialName) {
        return materialRepository.findByCompanyRegisterCompanyNameContainingAndMaterialNameContaining(companyName, materialName);
    }

    public List<MaterialRegister> getAllMaterials() {
        return materialRepository.findAll();
    }

    @Override
    public List<MaterialRegister> searchByParams(String materialName, String companyName) {
        // 업체명과 재료명이 모두 주어진 경우
        if (materialName != null && !materialName.isEmpty() && companyName != null && !companyName.isEmpty()) {
            return materialRepository.findByCompanyRegisterCompanyNameContainingAndMaterialNameContaining(companyName, materialName);
        }

        // 업체명만 주어진 경우
        if (companyName != null && !companyName.isEmpty()) {
            return materialRepository.findByCompanyRegisterCompanyNameContaining(companyName);
        }

        // 재료명만 주어진 경우
        if (materialName != null && !materialName.isEmpty()) {
            return materialRepository.findByMaterialNameContaining(materialName);
        }

        // 기본적으로 빈 리스트 반환
        return Collections.emptyList();
    }

    @Override
    public void updateMaterial(MaterialDTO materialDTO) {
        Optional<MaterialRegister> optionalMaterial = materialRepository.findByMaterialCode(materialDTO.getMaterialCode());

        MaterialRegister materialRegister;

        if (optionalMaterial.isPresent()) {
            // 기존 재료가 있을 경우 수정
            materialRegister = optionalMaterial.get();
            log.info("기존 재료를 수정합니다: {}", materialRegister);
        } else {
            // 새로운 재료를 등록 (수정 요청이지만 기존 재료가 없을 때)
            log.info("재료가 없으므로 새로 등록합니다: {}", materialDTO.getMaterialCode());
            materialRegister = new MaterialRegister();  // 새로운 객체 생성
            materialRegister.setMaterialCode(materialDTO.getMaterialCode());  // 새 재료의 코드 설정
        }

        // 공통적으로 재료 정보 수정/등록
        materialRegister.setMaterialName(materialDTO.getMaterialName());
        materialRegister.setMaterialUnit(materialDTO.getMaterialUnit());
        materialRegister.setMaterialUnitPrice(materialDTO.getMaterialUnitPrice());
        materialRegister.setMinQuantity(materialDTO.getMinQuantity());
        materialRegister.setStockManagementItem(materialDTO.isStockManagementItem());

        CompanyRegister company = companyRepository.findOptionalByCompanyCode(materialDTO.getCompanyCode())
                .orElseThrow(() -> new RuntimeException("해당 회사 정보를 찾을 수 없습니다: " + materialDTO.getCompanyCode()));
        materialRegister.setCompanyRegister(company);

        // 최종적으로 재료 정보 저장
        materialRepository.save(materialRegister);
    }




}

