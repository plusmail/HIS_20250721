package kroryi.his.controller;


import io.swagger.annotations.ApiOperation;
import jakarta.validation.Valid;
import kroryi.his.domain.CompanyRegister;
import kroryi.his.domain.MaterialRegister;
import kroryi.his.dto.MaterialDTO;
import kroryi.his.service.CompanyRegisterService;
import kroryi.his.service.MaterialRegisterService;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/inventory_management")
@Log4j2
@RequiredArgsConstructor
public class MaterialRegisterController {
    private final MaterialRegisterService materialRegisterService;
    private final CompanyRegisterService companyRegisterService;

    // 재료 등록
    @ApiOperation(value = "재료등록 POST", notes = "POST 방식으로 재료 등록")
    @PostMapping(value = "/addMaterial", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> register(@Valid @RequestBody MaterialDTO materialDTO,
                                        BindingResult bindingResult) throws BindException {

        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        Map<String, Object> result = new HashMap<>();

        try {
            // 재료 등록
            MaterialRegister materialRegister = materialRegisterService.register(materialDTO);

            // 성공 응답
            result.put("success", true);
            result.put("materialRegister", materialRegister);
        } catch (IllegalArgumentException e) {
            // 중복된 경우 예외 처리 및 실패 응답
            log.warn("재료 등록 실패: {}", e.getMessage());
            result.put("success", false);
            result.put("message", e.getMessage());
        }

        return result;
    }

    @GetMapping("/searchMaterial")
    public List<MaterialDTO> searchMaterial(@RequestParam(value = "materialName", required = false) String materialName) {
        List<MaterialRegister> materials;

        if (materialName == null || materialName.isEmpty()) {
            materials = materialRegisterService.getAllMaterial();  // 검색어가 없을 때 전체 재료 반환
        } else {
            materials = materialRegisterService.searchByName(materialName);  // 검색어에 따른 재료 반환
        }

        // MaterialRegister 리스트를 DTO 리스트로 변환
        return materials.stream()
                .map(MaterialDTO::new)  // MaterialDTO의 생성자를 활용
                .collect(Collectors.toList());
    }




    // 재료 삭제
    @DeleteMapping("/deleteMaterial")
    public ResponseEntity<String> deleteMaterial(@RequestParam String materialCode) {
        // 재료 삭제 로직
        materialRegisterService.customDeleteByMaterialCode(materialCode);
        return ResponseEntity.ok("재료가 성공적으로 삭제되었습니다.");
    }

    @GetMapping("/searchCompanies")
    public ResponseEntity<List<CompanyRegister>> searchCompanies() {
        // DB에서 전체 업체 목록을 가져옴
        List<CompanyRegister> companies = companyRegisterService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }



}
