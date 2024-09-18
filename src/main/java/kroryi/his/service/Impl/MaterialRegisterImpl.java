package kroryi.his.service.Impl;

import kroryi.his.domain.CompanyRegister;
import kroryi.his.domain.MaterialRegister;
import kroryi.his.repository.CompanyRegisterRepository;
import kroryi.his.repository.MaterialRegisterRepository;
import kroryi.his.service.MaterialRegisterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Log4j2
public class MaterialRegisterImpl implements MaterialRegisterService {
    private final MaterialRegisterRepository materialRegisterRepository;
    private final CompanyRegisterRepository companyRegisterRepository;
    private final ModelMapper modelMapper;


    @Override
    public MaterialRegister registerMaterial() {
        // companyCode가 "dt123"인 CompanyRegister 객체를 찾음
        CompanyRegister company = companyRegisterRepository.findById("dt123")
                .orElseThrow(() -> new RuntimeException("Company not found"));

        MaterialRegister material = MaterialRegister.builder()
                .materialName("봉합사")
                .materialCode("code")
                .materialUnit("100ea/1box")
                .materialUnitPrice(30L)
                .minQuantity(2L)
                .stockManagementItem(true)
                .firstRegisterDate(LocalDate.now())
                .companyRegister(company)  // CompanyRegister 객체 설정
                .build();

        log.info("materialRegister: {}", material);

        return materialRegisterRepository.save(material);
    }

}
