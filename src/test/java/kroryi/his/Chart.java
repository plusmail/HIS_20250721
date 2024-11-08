package kroryi.his;

import kroryi.his.domain.MedicalChart;
import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.dto.MedicalChartSearchDTO;
import kroryi.his.service.ChartService;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;

@SpringBootTest
@Log4j2
public class Chart {
    @Autowired
    private ChartService chartService;
//
//    @Test
//    public void testSearchMedicalCharts_ByDateRange() {
//        // 검색 조건 DTO 생성
//        MedicalChartSearchDTO searchCriteria = new MedicalChartSearchDTO();
//        searchCriteria.setChartNum("240911011");
//        searchCriteria.setCheckDoc("김관호");
//
//        // 검색 실행
//        List<MedicalChart> results = chartService.searchMedicalCharts(searchCriteria);
//log.info("@@@@@@@@@@@@@@ {}",results.toString());
//    }

    /*@Test
    public void testSearchMedicalCharts_ByTeethNum() {
        // Create search criteria DTO
        MedicalChartSearchDTO searchCriteria = new MedicalChartSearchDTO();
        searchCriteria.setChartNum("240911011");  // Mandatory field

        // Set teethNum as a comma-separated string
        List<String> teethNums = List.of("27","42");
        log.info(teethNums.toString());
        searchCriteria.setTeethNum(teethNums);

        // Execute the search
//        List<MedicalChart> results = chartService.searchMedicalCharts(searchCriteria);
        List<MedicalChart> results = chartService.searchMedicalCharts(teethNums);
        // Log the results
        log.info("@@@@@@@@@@@@@@ {}", results.toString());
    }*/

}
