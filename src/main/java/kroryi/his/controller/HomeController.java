package kroryi.his.controller;


import kroryi.his.domain.Member;
import kroryi.his.domain.MemberRole;
import kroryi.his.dto.MemberJoinDTO;
import kroryi.his.service.MemberService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@Log4j2
public class HomeController {
    @GetMapping("/home")
    public String home() {
        return "admin_management";
    }

    //    사용자관리
    @Autowired
    private MemberService memberService;  // UserService 주입

    @GetMapping("/admin_management")
    public String adminManagement(Model model) {
        // 사용자 목록을 가져옴
        List<MemberJoinDTO> members = memberService.getMembers();
        // 모델에 사용자 목록을 추가
        log.info("members: " + members);
        model.addAttribute("members", members);

        // admin_management.jsp로 이동 (또는 다른 뷰 템플릿)
        return "admin_management";
    }

    //    환자등록
    @GetMapping("/patient_register")
    public String patient_register() {
        return "patient_register";
    }

    //    진료예약
    @GetMapping("/reservation")
    public String reservation() {
        return "reservation";
    }

    //    진료차트
    @GetMapping("/medical_chart")
    public String medical_chart() {
        return "medical_chart";
    }

    //    진료접수
    @GetMapping("/reception")
    public String reception() {
        return "reception";
    }

    //    재고관리
    @GetMapping("/inventory_management")
    public String inventory_management() {
        return "inventory_management";
    }
}
