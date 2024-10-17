package kroryi.his.controller;

import kroryi.his.domain.ChartMemo;
import kroryi.his.domain.MedicalChart;
import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.repository.ChartMemoRepository;
import kroryi.his.service.ChartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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


    // 메모 추가. 추후 계정 연동 시 계정에 따라 저장되도록 수정 필요.
    @PostMapping("/saveMemos")
    public ChartMemo saveMemo(@RequestBody ChartMemo newMemo) {
        return chartService.saveMemo(newMemo);  // 새로운 메모를 저장하고 저장된 객체 반환
    }

    //모달 실행 시 db에 저장된 자주사용하는 메모 내용을 불러옴.추후 계정 연동 시 계정에따라 저장된 데이터 필터해서 가지고오도록 수정 필요
    @GetMapping("/")
    public List<ChartMemo> getMedicalCharts() {
        // JSON 형태로 반환
        return chartService.getAllMedicalChartsMemo();
    }
    @PostMapping("/saveData")
    public String addData(@RequestBody MedicalChartDTO medicalChartDTO) {
        log.info("chartController -------> 1111111");
        chartService.addMedicalChart(medicalChartDTO);

        return "Data saved successfully!";
    }

    @GetMapping("/getChartData")
    public List<MedicalChart> searchByChartNum(@RequestParam String chartNum) {
        log.info("getChartData ---------->{}",chartService.getChart(chartNum));
        return chartService.getChart(chartNum);
    }
}

