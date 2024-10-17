package kroryi.his.controller;

import io.swagger.annotations.ApiOperation;
import jakarta.validation.Valid;
import kroryi.his.dto.PatientMemoDTO;
import kroryi.his.service.PatientRegisterMemoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/patient_register/memo")
@Log4j2
@RequiredArgsConstructor
public class PatientRegisterMemoController {
    private final PatientRegisterMemoService patientRegisterMemoService;

    @ApiOperation(value = "환자등록 POST", notes = "POST 방식으로 환자 등록")
    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    public List<Long> register(@Valid @RequestBody List<PatientMemoDTO> patientMemoDTOs,
                                      BindingResult bindingResult) throws BindException {
        log.info("********-> {}", patientMemoDTOs);

        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        Map<String, Long> resultMap = new HashMap<>();
        List<Long> resultList = new ArrayList<>();
        for (PatientMemoDTO patientMemoDTO : patientMemoDTOs) {
            Long mmo = patientRegisterMemoService.register(patientMemoDTO);
            log.info("Registered memo with ID: {}", mmo);
            resultList.add(mmo);
        }

        return resultList;
    }

    @ApiOperation(value = "Delete Memo", notes = "DELETE 방식으로 삭제")
    @DeleteMapping("/remove/{mmo}")
    public Map<String, String> delete(@PathVariable Long mmo) {
        log.info("patientRegisterService->{}", mmo);
        patientRegisterMemoService.remove(mmo);

        Map<String, String> resultMap = new HashMap<>();
        resultMap.put("success_code", "4");
        resultMap.put("msg", mmo + "를 삭제했습니다.");
        resultMap.put("mmo", String.valueOf(mmo));

        return resultMap;
    }

    @ApiOperation(value = "Modify Memo", notes = "PUT 방식으로 수정")
    @PutMapping(value = "/modify/{mmo}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, String> modify(@PathVariable Long mmo, @RequestBody PatientMemoDTO patientMemoDTO) {
        patientMemoDTO.setMmo(mmo);
        log.info("patientRegisterService->{}", patientMemoDTO.toString());
        Map<String, String> resultMap = new HashMap<>();
        patientRegisterMemoService.modify(patientMemoDTO);
        resultMap.put("success_code", "4");
        resultMap.put("mmo", String.valueOf(mmo));

        return resultMap;
    }
}
