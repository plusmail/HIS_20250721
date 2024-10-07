package kroryi.his.controller;

import jakarta.servlet.http.HttpSession;
import kroryi.his.domain.ChartMemo;
import kroryi.his.repository.ChartMemoRepository;
import kroryi.his.service.ChartService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

//@Controller
@RequestMapping("/medical_chart")
@Log4j2
@RequiredArgsConstructor
@Controller
@RestController
public class ChartController {
    @Autowired
    private final ChartService chartService;
    @Autowired
    private final ChartMemoRepository chartMemoRepository;


    @PostMapping("/saveMemos")

    public ChartMemo saveMemo(@RequestBody ChartMemo newMemo) {
        return chartService.saveMemo(newMemo);  // 새로운 메모를 저장하고 저장된 객체 반환
    }

    @GetMapping("/")
    public List<ChartMemo> getMedicalCharts() {
        // JSON 형태로 반환
        return chartService.getAllMedicalCharts();
    }
}

