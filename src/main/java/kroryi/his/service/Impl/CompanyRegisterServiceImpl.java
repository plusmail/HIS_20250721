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

//가짜데이터 등록
//    @Override
//    public CompanyRegister registerCompany() {
//        CompanyRegister company = CompanyRegister.builder()
//                .companyCode("dt12345")
//                .companyName("조은이덴탈2")
//                .businessNumber("0156132154")
//                .companyNumber("053-0000-0000")
//                .managerName("백지영2")
//                .managerNumber("010-0000-0000")
//                .companyMemo("첫 업체 등록")
//                .build();
//        log.info("company->{}", company);
//        return companyRegisterRepository.save(company);
//    }

    @Override
    public List<CompanyRegister> getAllCompanies() {
        return companyRegisterRepository.findAll();
    }

    // 업체코드 중복체크 로직
    @Override
    public boolean isCompanyCodeDuplicate(String companyCode) {
        return companyRegisterRepository.existsByCompanyCode(companyCode);
    }

    // 실제 업체 등록시 업체코드 중복체크
    @Override
    public CompanyRegister register(CompanyDTO companyDTO) {
        if (isCompanyCodeDuplicate(companyDTO.getCompanyCode())) {
            throw new IllegalArgumentException("이미 등록된 업체입니다.");
        }

        CompanyRegister companyRegister = modelMapper.map(companyDTO, CompanyRegister.class);
        return companyRegisterRepository.save(companyRegister);
    }

    // 업체 검색
    @Override
    public List<CompanyRegister> searchByName(String companyName) {
        return companyRegisterRepository.findByCompanyNameContainingIgnoreCase(companyName);
    }

    // 업체 삭제
    @Override
    public void deleteCompany(String companyCode) {
        companyRegisterRepository.deleteById(companyCode);
    }






}