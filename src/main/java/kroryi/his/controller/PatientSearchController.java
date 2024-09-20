package kroryi.his.controller;

import io.swagger.annotations.ApiOperation;
import kroryi.his.domain.PatientRegister;
import kroryi.his.dto.SearchKeywordDTO;
import kroryi.his.service.Impl.PatientRegisterServiceImpl;
import kroryi.his.service.PatientRegisterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.repository.query.Param;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/patient_search")
@Log4j2
@RequiredArgsConstructor
public class PatientSearchController {
    private final PatientRegisterService patientRegisterService;

    @ApiOperation(value = "환자등록 POST", notes = "POST 방식으로 환자 등록")
    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String,Object> searchName(@RequestBody SearchKeywordDTO keyword) {
        log.info("keyword: {}", keyword);
        Map<String,Object> result = new HashMap<>();

        List<PatientRegister> registers = patientRegisterService.searchName(keyword.getKeyword());
        for (PatientRegister register : registers) {
            log.info(register.toString());
        }
        result.put("result", registers);
        return result;
    }
}
