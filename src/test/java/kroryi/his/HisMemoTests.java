package kroryi.his;

import kroryi.his.domain.PatientRegister;
import kroryi.his.domain.PatientRegisterMemo;
import kroryi.his.dto.PatientMemoDTO;
import kroryi.his.repository.PatientMemoRepository;
import kroryi.his.service.PatientRegisterService;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
@Log4j2
//@DataJpaTest
public class HisMemoTests {

    @Autowired
    PatientMemoRepository patientMemoRepository;

    @Autowired
    PatientRegisterService patientRegisterService;

    @Test
    public void testMemoList(){
        List<PatientRegisterMemo> patientMemoDTO = patientMemoRepository.findAll();
        for (PatientRegisterMemo memo : patientMemoDTO) {
            log.info("memo---->{}",memo.toString());
        }

    }

    @Test
    public void testSearchName(){

        List<PatientRegister> registers = patientRegisterService.searchNameByKeyword("이재준");
        for (PatientRegister register : registers) {
            log.info(register.toString());
        }
    }

    @Test
    public void testRemove() {
        String chartNum = "241002007";
        patientRegisterService.remove(chartNum);
        log.info("remove->{}", chartNum);
    }
}
