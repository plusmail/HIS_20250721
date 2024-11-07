package kroryi.his.controller;

import kroryi.his.domain.MedicalChart;
import kroryi.his.domain.PatientRegister;
import kroryi.his.dto.ChartPlan;
import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.service.Impl.ChartServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Log4j2
@RequiredArgsConstructor
@RestController
public class ChartPlanController {

    @Autowired
    private ChartServiceImpl service;

    @Autowired
    private ChartController chartController;

    @PostMapping("/medical_chart/savePlan")
    private ResponseEntity<Map<String, Object>> savePlan(@RequestBody MedicalChartDTO medicalChart) {
        // Create response data map with saved details
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("chartNum", medicalChart.getChartNum());
        responseData.put("paName", medicalChart.getPaName());
        responseData.put("teethNum", medicalChart.getTeethNum());
        responseData.put("medicalContent", medicalChart.getMedicalContent());
        responseData.put("medicalDivision", medicalChart.getMedicalDivision());
        responseData.put("mdTime", medicalChart.getMdTime());
        responseData.put("checkDoc", medicalChart.getCheckDoc());
        responseData.put("cnum", medicalChart.getCnum());

        service.MedicalChartSave(medicalChart);

        // Return ResponseEntity with custom message and data
        return ResponseEntity
                .status(HttpStatus.CREATED) // Set HTTP status to 201 Created
                .body(responseData);        // Include response data in the body
    }

    @PostMapping("/medical_chart/updatePlan")
    private Map<String, Object> updatePlan(@RequestBody MedicalChartDTO medicalChart) {
        service.MedicalChartUpdate(medicalChart);
        // Create response data map with saved details
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("chartNum", medicalChart.getChartNum());
        responseData.put("paName", medicalChart.getPaName());
        responseData.put("teethNum", medicalChart.getTeethNum());
        responseData.put("medicalContent", medicalChart.getMedicalContent());
        responseData.put("medicalDivision", medicalChart.getMedicalDivision());
        responseData.put("mdTime", medicalChart.getMdTime());
        responseData.put("checkDoc", medicalChart.getCheckDoc());
        responseData.put("cnum", medicalChart.getCnum());


        // Return ResponseEntity with custom message and data
        return responseData;      // Include response data in the body
    }


    @PostMapping("/medical_chart/delPlan")
    private ResponseEntity<?> delPlan(@RequestBody ChartPlan chartPlan) {

        log.info("딜리트");
        log.info("data -----> {}", chartPlan);
        log.info("chartNum ----> {}", chartController.getChartNum());
        log.info("charPa -------> {}", chartController.getPaName());

        String chartNum = chartController.getChartNum();
        String chartPa = chartController.getPaName();

        String teethOne = chartPlan.getToothOne();
        String planOne = chartPlan.getPlanOne();

        service.deleteChart(chartNum, chartPa, teethOne, planOne);


        return null;

    }

}
