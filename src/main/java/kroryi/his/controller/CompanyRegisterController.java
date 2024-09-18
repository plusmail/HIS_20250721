package kroryi.his.controller;

import io.swagger.annotations.ApiOperation;
import jakarta.validation.Valid;
import kroryi.his.domain.CompanyRegister;
import kroryi.his.dto.CompanyDTO;
import kroryi.his.service.CompanyRegisterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/inventory_management")
@Log4j2
@RequiredArgsConstructor
public class CompanyRegisterController {
    private final CompanyRegisterService companyRegisterService;

    @ApiOperation(value = "회사등록 POST", notes = "POST 방식으로 회사 등록")
    @PostMapping(value = "/", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<Map<String, Object>> register(@ModelAttribute CompanyDTO companyDTO) {
        log.info("CompanyDTO->{}", companyDTO);

        CompanyRegister companyRegister = companyRegisterService.register(companyDTO);
        log.info("CompanyRegister->{}", companyRegister);

        Map<String, Object> result = new HashMap<>();
        result.put("companyRegister", companyRegister);

        return ResponseEntity.ok(result);
    }

    @ApiOperation(value = "업체목록 GET", notes = "DB에 등록된 업체 목록 조회")
    @GetMapping("/")
    public ResponseEntity<List<CompanyRegister>> getAllCompanies() {
        List<CompanyRegister> companies = companyRegisterService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }
}
