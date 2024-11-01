package kroryi.his.controller;

import kroryi.his.dto.ChartPlan;
import kroryi.his.dto.RequestData;
import kroryi.his.service.Impl.ChartServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RequiredArgsConstructor
@RestController
public class ChartPlanController {

    @Autowired
    private ChartServiceImpl service;

    @Autowired
    private ChartController chartController;

    @PostMapping("/medical_chart/savePlan")
    private ResponseEntity<?> savePlan(@RequestBody ChartPlan chartPlan) {

        log.info("data -----> {}", chartPlan);
        log.info("chartNum ----> {}", chartController.getChartNum());
        log.info("charPa -------> {}", chartController.getPaName());

        String chartNum = chartController.getChartNum();
        String chartPa = chartController.getPaName();

        String teethOne = chartPlan.getToothOne();
        String planOne = chartPlan.getPlanOne();

        service.addMedicalChart(teethOne, planOne, chartNum, chartPa);


        return null;

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
