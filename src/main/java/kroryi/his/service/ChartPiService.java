package kroryi.his.service;

import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.dto.RequestData;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ChartPiService {
    List<List<String>> getSessionItems(Object sessionAttribute);

    void saveMedicalChart(MedicalChartDTO medicalChartDTO);
}
