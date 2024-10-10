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

    @ApiOperation(value = "keyword 검색 POST", notes = "POST 방식으로 환자 검색")
    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String,Object> searchName(@RequestBody SearchKeywordDTO keyword) {
        log.info("keyword: {}", keyword);
        Map<String,Object> result = new HashMap<>();

        // 키워드로 환자 검색
        List<PatientRegister> registers = patientRegisterService.searchNameByKeyword(keyword.getKeyword());

        for (PatientRegister register : registers) {
            log.info(register.toString());
        }

        result.put("result", registers);
        return result;
    }

    @ApiOperation(value = "환자검색 POST", notes = "POST 방식으로 환자 정보")
    @PostMapping(value = "/{chartNum}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String,Object> searchChartNum(@PathVariable String chartNum) {
        log.info("chartNum: {}", chartNum);
        Map<String,Object> result = new HashMap<>();

        // 키워드로 환자 검색
        PatientRegister register = patientRegisterService.getPatient(chartNum);

            log.info(register.toString());

        result.put("result", register);
        return result;
    }
}
