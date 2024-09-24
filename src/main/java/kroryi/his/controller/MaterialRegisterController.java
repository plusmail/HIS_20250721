package kroryi.his.controller;


import io.swagger.annotations.ApiOperation;
import jakarta.validation.Valid;
import kroryi.his.domain.CompanyRegister;
import kroryi.his.domain.MaterialRegister;
import kroryi.his.dto.CompanyDTO;
import kroryi.his.dto.MaterialDTO;
import kroryi.his.service.CompanyRegisterService;
import kroryi.his.service.MaterialRegisterService;
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
public class MaterialRegisterController {
    private final MaterialRegisterService materialRegisterService;

    @GetMapping("/search")
    public List<MaterialRegister> searchMaterial(@RequestParam(value = "materialName", required = false) String materialName) {
        if (materialName == null || materialName.isEmpty()) {
            return materialRegisterService.getAllMaterial();  // 검색어가 없을 때 전체 업체 반환
        }
        return materialRegisterService.searchByName(materialName);  // 검색어에 따른 업체 반환
    }

    // 업체 추가
    @PostMapping("/add")
    public ResponseEntity<?> addMaterial(@RequestBody MaterialRegister material) {
        try {
            materialRegisterService.addMaterial(material);
            return ResponseEntity.ok(Collections.singletonMap("success", true));
        } catch (IllegalArgumentException e) {
            // 중복일 경우 에러 메시지 전달
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    // 업체 삭제
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteMaterial(@RequestParam String materialCode) {
        // 회사 삭제 로직
        materialRegisterService.deleteMaterial(materialCode);
        return ResponseEntity.ok("재료가 삭제되었습니다.");
    }

    @ApiOperation(value = "재료등록 POST", notes = "POST 방식으로 재료 등록")
    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, MaterialRegister> register(@Valid @RequestBody MaterialDTO materialDTO,
                                                  BindingResult bindingResult) throws BindException {
        log.info("MaterialDTO->{}", materialDTO);

        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        Map<String, MaterialRegister> result = new HashMap<>();
        MaterialRegister materialRegister = materialRegisterService.register(materialDTO);
        log.info("CompanyRegister->{}", materialRegister);
        result.put("companyRegister", materialRegister);
        return result;
    }
}
