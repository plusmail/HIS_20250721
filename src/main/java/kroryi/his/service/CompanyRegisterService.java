package kroryi.his.service;

import kroryi.his.domain.CompanyRegister;
import kroryi.his.dto.CompanyDTO;

import java.util.List;


public interface CompanyRegisterService {
    CompanyRegister register(CompanyDTO companyDTO);

    CompanyRegister registerCompany();

    List<CompanyRegister> searchByName(String companyName);

    boolean isCompanyCodeDuplicate(String companyCode);

    void addCompany(CompanyRegister company);

    void deleteCompany(String companyCode);

    List<CompanyRegister> getAllCompanies();

}
