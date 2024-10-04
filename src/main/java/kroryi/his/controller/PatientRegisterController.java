package kroryi.his.controller;

import io.swagger.annotations.ApiOperation;
import jakarta.validation.Valid;
import kroryi.his.domain.PatientRegister;
import kroryi.his.dto.PatientDTO;
import kroryi.his.service.Impl.PatientRegisterServiceImpl;
import kroryi.his.service.PatientRegisterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/patient_register")
@Log4j2
@RequiredArgsConstructor
public class PatientRegisterController {
    private final PatientRegisterService patientRegisterService;
    private final PatientRegisterServiceImpl patientRegisterServiceImpl;

    @ApiOperation(value = "환자등록 POST", notes = "POST 방식으로 환자 등록")
    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String,PatientRegister> register(@Valid @RequestBody PatientDTO patientDTO,
                        BindingResult bindingResult)throws BindException {
        log.info("->{}",patientDTO);

        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        Map<String, PatientRegister> resultMap = new HashMap<>();
        PatientRegister patientRegister = patientRegisterService.register(patientDTO);
        log.info("chartNum --{}",patientRegister);

        resultMap.put("patientRegister", patientRegister);

        return resultMap;
    }

    @ApiOperation(value = "Delete Patient", notes = "DELETE 방식으로 삭제")
    @DeleteMapping("/remove/{chartNum}")
    public Map<String, String> delete(@PathVariable String chartNum) {
        log.info("patientRegisterService->{}",chartNum);
        patientRegisterService.remove(chartNum);

        Map<String, String> resultMap = new HashMap<>();
        resultMap.put("success_code", "4");
        resultMap.put("msg", chartNum + "를 삭제했습니다.");
        resultMap.put("rno", String.valueOf(chartNum));

        return resultMap;
    }
}
