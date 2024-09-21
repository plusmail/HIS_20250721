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

    @GetMapping("/search")
    public List<CompanyRegister> searchCompanies(@RequestParam(value = "companyName", required = false) String companyName) {
        if (companyName == null || companyName.isEmpty()) {
            return companyRegisterService.getAllCompanies();  // 검색어가 없을 때 전체 업체 반환
        }
        return companyRegisterService.searchByName(companyName);  // 검색어에 따른 업체 반환
    }

    // 업체 추가
    @PostMapping("/add")
    public ResponseEntity<?> addCompany(@RequestBody CompanyRegister company) {
        try {
            companyRegisterService.addCompany(company);
            return ResponseEntity.ok(Collections.singletonMap("success", true));
        } catch (IllegalArgumentException e) {
            // 중복일 경우 에러 메시지 전달
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    // 업체 삭제
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteCompany(@RequestParam String companyCode) {
        // 회사 삭제 로직
        companyRegisterService.deleteCompany(companyCode);
        return ResponseEntity.ok("업체가 삭제되었습니다.");
    }

    @ApiOperation(value = "회사등록 POST", notes = "POST 방식으로 회사 등록")
    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, CompanyRegister> register(@Valid @RequestBody CompanyDTO companyDTO,
                                                 BindingResult bindingResult) throws BindException {
        log.info("CompanyDTO->{}", companyDTO);

        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        Map<String, CompanyRegister> result = new HashMap<>();
        CompanyRegister companyRegister = companyRegisterService.register(companyDTO);
        log.info("CompanyRegister->{}", companyRegister);
        result.put("companyRegister", companyRegister);
        return result;
    }
}
