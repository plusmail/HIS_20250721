package kroryi.his.controller;

import io.swagger.annotations.ApiOperation;
import jakarta.validation.Valid;
import kroryi.his.domain.CompanyRegister;
import kroryi.his.dto.CompanyDTO;
import kroryi.his.service.CompanyRegisterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/inventory_management")
@Log4j2
@RequiredArgsConstructor
public class CompanyRegisterController {
    private final CompanyRegisterService companyRegisterService;

    // 업체 등록
    @ApiOperation(value = "회사등록 POST", notes = "POST 방식으로 회사 등록")
    @PostMapping(value = "/addCompany", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> register(@Valid @RequestBody CompanyDTO companyDTO,
                                        BindingResult bindingResult) throws BindException {
        log.info("CompanyDTO->{}", companyDTO);

        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        Map<String, Object> result = new HashMap<>();

        try {
            // 회사 등록
            CompanyRegister companyRegister = companyRegisterService.register(companyDTO);
            log.info("CompanyRegister->{}", companyRegister);

            // 성공 응답
            result.put("success", true);
            result.put("companyRegister", companyRegister);
        } catch (IllegalArgumentException e) {
            // 중복된 경우 예외 처리 및 실패 응답
            log.warn("회사 등록 실패: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }

        return result;
    }

    // 업체 검색
    @GetMapping("/searchCompany")
    public List<CompanyRegister> searchCompanies(@RequestParam(value = "companyName", required = false) String companyName) {
        if (companyName == null || companyName.isEmpty()) {
            return companyRegisterService.getAllCompanies();  // 검색어가 없을 때 전체 업체 반환
        }
        return companyRegisterService.searchByName(companyName);  // 검색어에 따른 업체 반환
    }


    // 업체 삭제
    @DeleteMapping("/deleteCompany")
    public ResponseEntity<String> deleteCompany(@RequestParam String companyCode) {
        companyRegisterService.deleteCompany(companyCode);
        return ResponseEntity.ok("업체가 성공적으로 삭제되었습니다.");
    }
}
