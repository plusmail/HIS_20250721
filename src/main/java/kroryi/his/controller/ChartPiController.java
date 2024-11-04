package kroryi.his.controller;

import jakarta.servlet.http.HttpSession;
import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.dto.RequestData;
import kroryi.his.service.ChartPiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static kroryi.his.domain.QMedicalChart.medicalChart;

@Log4j2
@RequiredArgsConstructor
@RequestMapping("/medical_chart")
@RestController
public class ChartPiController {

    private final ChartPiService chartPiService;

    @GetMapping("/get-session-items")
    public List<List<String>> getSessionItems(HttpSession session) {
        return chartPiService.getSessionItems(session.getAttribute("nestedList"));
    }

    @PostMapping("/savePiChart")
    private ResponseEntity<Map<String, Object>> saveMedicalPiChart(@RequestBody MedicalChartDTO medicalChartDTO) {
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("chartNum",medicalChartDTO.getChartNum());
        responseData.put("paName", medicalChartDTO.getPaName());
        responseData.put("teethNum", medicalChartDTO.getTeethNum());
        responseData.put("medicalContent", medicalChartDTO.getMedicalContent());
        responseData.put("medicalDivision", medicalChartDTO.getMedicalDivision());
        responseData.put("mdTime", medicalChartDTO.getMdTime());
        responseData.put("checkDoc",medicalChartDTO.getCheckDoc());
log.info(responseData);
        chartPiService.saveMedicalChart(medicalChartDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED) // Set HTTP status to 201 Created
                .body(responseData);        // Include response data in the body
    }
}
