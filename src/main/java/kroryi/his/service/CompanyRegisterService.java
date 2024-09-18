package kroryi.his.service;

import kroryi.his.domain.CompanyRegister;
import kroryi.his.dto.CompanyDTO;



public interface CompanyRegisterService {
    CompanyRegister registerCompany();
    CompanyRegister register(CompanyDTO companyDTO);

}
