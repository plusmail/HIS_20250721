package kroryi.his.service;

import kroryi.his.dto.MedicalChartDTO;

import java.util.List;

public interface ChartCPService {
    List<List<String>> getSessionItems(Object sessionAttribute);

    void saveMedicalChart(MedicalChartDTO medicalChartDTO);
}
