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
        log.info("chartNum ----> {}",chartController.getChartNum());
        log.info("charPa -------> {}",chartController.getPaName());

        String chartNum = chartController.getChartNum();
        String chartPa = chartController.getPaName();

         String teethOne = chartPlan.getToothOne();
        String teethTwo = chartPlan.getToothTwo();
        String planOne = chartPlan.getPlanOne();
        String planTwo = chartPlan.getPlanTwo();

        service.addMedicalChart(teethOne,planOne,chartNum,chartPa);
        if(!teethTwo.equals("치아 선택") && !teethTwo.equals("치료계획 선택") ) {
            service.addMedicalChart(teethTwo,planTwo,chartNum,chartPa);
        }


        return null;

    }

}
