package kroryi.his.controller;

import jakarta.servlet.http.HttpSession;
import kroryi.his.domain.MedicalChart;
import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.service.ChartCPService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RequiredArgsConstructor
@RequestMapping("/medical_chart")
@RestController
public class ChartCPController {

    private final ChartCPService chartCPService;

    @GetMapping("/get-session-items")
    public List<List<String>> getSessionItems(HttpSession session) {
        return chartCPService.getSessionItems(session.getAttribute("nestedList"));
    }

    @PostMapping({"/savePiChart", "/saveCcChart"})
    public ResponseEntity<Void> saveMedicalPiChart(@RequestBody MedicalChartDTO medicalChartDTO) {
        chartCPService.saveMedicalChart(medicalChartDTO);
        return ResponseEntity.ok().build(); // 성공적으로 저장된 경우
    }


    @GetMapping("/getDataByCnum")
    public ResponseEntity<MedicalChartDTO> getDataByCnum(@RequestParam("cnum") Integer cnum) {
        MedicalChartDTO medicalChartDTO = chartCPService.getMedicalChartByCnum(cnum);
        if (medicalChartDTO != null) {
            return ResponseEntity.ok(medicalChartDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
