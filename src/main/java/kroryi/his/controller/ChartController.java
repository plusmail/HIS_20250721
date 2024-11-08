package kroryi.his.controller;

import kroryi.his.domain.ChartMemo;
import kroryi.his.domain.MedicalChart;
import kroryi.his.dto.ChartPaData;
import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.dto.MedicalChartSearchDTO;
import kroryi.his.repository.ChartMemoRepository;
import kroryi.his.repository.MedicalChartRepository;
import kroryi.his.service.ChartService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@Controller
@RequestMapping("/medical_chart")
@Log4j2
@RequiredArgsConstructor
@Controller
@RestController
@Data
public class ChartController {
    @Autowired
    private final ChartService chartService;
    @Autowired
    private final ChartMemoRepository chartMemoRepository;
    @Autowired
    private final MedicalChartRepository medicalChartRepository;


    String paName;
    String chartNum;

    @PostMapping("/savePaList")
    private ResponseEntity<?> savePaList(@RequestBody ChartPaData paData) {
        paName = paData.getPaName();
        chartNum = paData.getChartNum();
        return ResponseEntity.ok(paName);
    }


    // 메모 추가. 추후 계정 연동 시 계정에 따라 저장되도록 수정 필요.
    @PostMapping("/saveMemos")
    public ChartMemo saveMemo(@RequestBody ChartMemo newMemo) {
        return chartService.saveMemo(newMemo);  // 새로운 메모를 저장하고 저장된 객체 반환
    }

    //모달 실행 시 db에 저장된 자주사용하는 메모 내용을 불러옴.추후 계정 연동 시 계정에따라 저장된 데이터 필터해서 가지고오도록 수정 필요
    @GetMapping("/getMemo")
    public List<ChartMemo> getMedicalCharts() {
        // JSON 형태로 반환
        return chartService.getAllMedicalChartsMemo();
    }

    @PostMapping("/saveData")
    public String addData(@RequestBody MedicalChartDTO medicalChartDTO) {
        chartService.addMedicalChart(medicalChartDTO);

        return "Data saved successfully!";
    }

    @GetMapping("/getChartData")
    public List<MedicalChart> searchByChartNum(@RequestParam String chartNum) {
        return chartService.getChart(chartNum);
    }

    @GetMapping("/PLANChartData")
    public List<MedicalChart> searchByChartNumMedicalDivision(@RequestParam String chartNum) {
        return chartService.PLANChart(chartNum, "PLAN");
    }

    @Transactional
    @DeleteMapping("/deleteChart")
    public ResponseEntity<?> deleteChart(@RequestParam Integer cnum) {
        chartService.deleteChart(cnum);
        return ResponseEntity.ok("차트내역이 성공적으로 삭제되었습니다!");
    }

    @PostMapping("/search")
    public ResponseEntity<List<MedicalChart>> searchMedicalCharts(@RequestBody MedicalChartSearchDTO medicalChartSearchDTO) {
        log.info("Received search criteria: {}", medicalChartSearchDTO);
        List<MedicalChart> results = chartService.searchMedicalCharts(medicalChartSearchDTO);
        log.info("Search results: {}", results);
        return ResponseEntity.ok(results);
    }
    }
