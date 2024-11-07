package kroryi.his.controller;


import kroryi.his.service.PatientRegisterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class MedicalChartController {
    private final PatientRegisterService patientRegisterService;
    @GetMapping("/medical_chart_cc")
    public String getMedicalChartCc(Model model) {
        List<String> doctorNames = patientRegisterService.getDoctorNames();
        model.addAttribute("doctorNames", doctorNames); // 의사 이름을 모델에 추가
        return "medical_chart_cc";
    }

    @GetMapping("/medical_chart_pi")
    public String getMedicalChartPi(Model model) {
        List<String> doctorNames = patientRegisterService.getDoctorNames();
        model.addAttribute("doctorNames", doctorNames); // 의사 이름을 모델에 추가
        return "medical_chart_pi";
    }

    @GetMapping("/medical_chart_plan")
    public String getMedicalChartPlan(Model model) {
        List<String> doctorNames = patientRegisterService.getDoctorNames();
        model.addAttribute("doctorNames", doctorNames); // 의사 이름을 모델에 추가
        return "medical_chart_plan";
    }

    @GetMapping("/medical_chart_input")
    public String getMedicalChartInput(Model model) {
        List<String> doctorNames = patientRegisterService.getDoctorNames();
        model.addAttribute("doctorNames", doctorNames); // 의사 이름을 모델에 추가
        return "medical_chart_input";
    }
}