package kroryi.his.service.Impl;

import kroryi.his.domain.CompanyRegister;
import kroryi.his.dto.CompanyDTO;
import kroryi.his.repository.CompanyRegisterRepository;
import kroryi.his.service.CompanyRegisterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class CompanyRegisterServiceImpl implements CompanyRegisterService {

    private final CompanyRegisterRepository companyRegisterRepository;
    private final ModelMapper modelMapper;


    @Override
    public CompanyRegister registerCompany() {
        CompanyRegister company = CompanyRegister.builder()
                .companyCode("dt12345")
                .companyName("조은이덴탈2")
                .businessNumber("0156132154")
                .companyNumber("053-0000-0000")
                .managerName("백지영2")
                .managerNumber("010-0000-0000")
                .companyMemo("첫 업체 등록")
                .build();
        log.info("company->{}", company);
        return companyRegisterRepository.save(company);
    }

    @Override
    public List<CompanyRegister> searchByName(String companyName) {
        return companyRegisterRepository.findByCompanyNameContainingIgnoreCase(companyName);
    }

    @Override
    public boolean isCompanyCodeDuplicate(String companyCode) {
        return companyRegisterRepository.existsByCompanyCode(companyCode);
    }

    @Override
    public void addCompany(CompanyRegister company) {
        if (isCompanyCodeDuplicate(company.getCompanyCode())) {
            throw new IllegalArgumentException("중복된 회사 코드입니다.");
        }
        companyRegisterRepository.save(company);
    }

    @Override
    public void deleteCompany(String companyCode) {
        companyRegisterRepository.deleteById(companyCode);
    }

    @Override
    public List<CompanyRegister> getAllCompanies() {
        return companyRegisterRepository.findAll();
    }

    @Override
    public CompanyRegister register(CompanyDTO companyDTO) {
        CompanyRegister companyRegister = modelMapper.map(companyDTO, CompanyRegister.class);

        return companyRegisterRepository.save(companyRegister);
    }


}