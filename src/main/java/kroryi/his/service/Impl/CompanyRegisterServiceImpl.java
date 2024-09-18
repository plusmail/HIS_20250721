package kroryi.his.service.Impl;

import kroryi.his.domain.CompanyRegister;
import kroryi.his.dto.CompanyDTO;
import kroryi.his.repository.CompanyRegisterRepository;
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

        // 기존 회사 코드로 데이터가 있는지 확인할 수 있습니다.
        if (companyRegisterRepository.findByCompanyCode(companyRegister.getCompanyCode()) != null) {
            throw new RuntimeException("동일한 업체코드가 존재합니다. 업체목록을 확인해주세요.");
        }

        return companyRegisterRepository.save(companyRegister);
    }


}
