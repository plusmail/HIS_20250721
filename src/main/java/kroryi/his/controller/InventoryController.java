package kroryi.his.controller;

import kroryi.his.service.MaterialRegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class InventoryController {

    @Autowired
    MaterialRegisterService materialService;


    @GetMapping("/material_status")
    public String getMaterialStatus(Model model) {
        // 필요한 데이터를 모델에 추가
        model.addAttribute("materials", "1111111111111");
        return "material_status"; // Thymeleaf 템플릿 경로
    }

    @GetMapping("/material_transaction")
    public String getMaterialTransaction(Model model) {
        // 데이터를 추가하여 렌더링
        model.addAttribute("transactions", "2222222222222222");
        return "material_transaction";
    }

    @GetMapping("/material_register")
    public String getMaterialRegister() {
        return "material_register";
    }

    @GetMapping("/company_register")
    public String getCompanyRegister() {
        return "company_register";
    }
}