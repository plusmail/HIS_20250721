package kroryi.his.service;

import kroryi.his.domain.CompanyRegister;
import kroryi.his.dto.CompanyDTO;



public interface CompanyRegisterService {
    CompanyRegister register(CompanyDTO companyDTO);
    CompanyRegister registerCompany();
}
