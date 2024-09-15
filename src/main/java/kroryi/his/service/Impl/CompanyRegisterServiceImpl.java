package kroryi.his.service.Impl;

import kroryi.his.domain.CompanyRegister;
import kroryi.his.dto.CompanyDTO;
import kroryi.his.repository.CompanyRegisterRepository;
import kroryi.his.repository.PatientRegisterRepository;
import kroryi.his.service.CompanyRegisterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class CompanyRegisterServiceImpl implements CompanyRegisterService {
    private final CompanyRegisterRepository companyRegisterRepository;
    private final ModelMapper modelMapper;


    @Override
    public CompanyRegister registerCompany() {
        CompanyRegister company = CompanyRegister.builder()
                .companyCode("dt123")
                .companyName("조은이덴탈")
                .businessNumber("0156132154")
                .companyNumber("053-0000-0000")
                .managerName("백지영")
                .managerNumber("010-0000-0000")
                .companyMemo("첫 업체 등록")
                .build();
        log.info("company->{}", company);
        return companyRegisterRepository.save(company);
    }

    @Override
    public CompanyRegister register(CompanyDTO companyDTO) {
        CompanyRegister companyRegister = modelMapper.map(companyDTO, CompanyRegister.class);

        return companyRegisterRepository.save(companyRegister);
    }


}
