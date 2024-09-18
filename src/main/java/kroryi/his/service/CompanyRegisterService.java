package kroryi.his.service;

import kroryi.his.domain.CompanyRegister;
import kroryi.his.dto.CompanyDTO;

import java.util.List;


public interface CompanyRegisterService {
    CompanyRegister registerCompany();
    CompanyRegister register(CompanyDTO companyDTO);

    List<CompanyRegister> getAllCompanies();

}
