package kroryi.his.controller;

import io.swagger.annotations.ApiOperation;
import jakarta.validation.Valid;
import kroryi.his.domain.CompanyRegister;
import kroryi.his.dto.CompanyDTO;
import kroryi.his.service.CompanyRegisterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/inventory_management")
@Log4j2
@RequiredArgsConstructor
public class CompanyRegisterController {
    private final CompanyRegisterService companyRegisterService;

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
