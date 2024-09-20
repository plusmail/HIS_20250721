package kroryi.his;


import kroryi.his.service.CompanyRegisterService;
import kroryi.his.service.MaterialRegisterService;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Log4j2
public class MaterialCompanyTests {
    @Autowired
    CompanyRegisterService companyRegisterService;

    @Autowired
    MaterialRegisterService materialRegisterService;

    @Test
    public void companyRegisterTest() {
        companyRegisterService.registerCompany();
    }

    @Test
    public void materialRegisterTest() {
        materialRegisterService.registerMaterial();
    }

}
