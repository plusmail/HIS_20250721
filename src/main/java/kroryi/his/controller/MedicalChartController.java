package kroryi.his.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MedicalChartController {
    @GetMapping("/medical_chart_cc")
    public String getMedicalChartCc() {
        return "medical_chart_cc";
    }

    @GetMapping("/medical_chart_pi")
    public String getMedicalChartPi() {
        return "medical_chart_pi";
    }

    @GetMapping("/medical_chart_plan")
    public String getMedicalChartPlan() {
        return "medical_chart_plan";
    }

    @GetMapping("/medical_chart_input")
    public String getMedicalChartInput() {
        return "medical_chart_input";
    }
}