package kroryi.his.service;

import kroryi.his.domain.MedicalChart;
import kroryi.his.dto.MedicalChartDTO;

import java.util.List;
import java.util.Optional;

public interface ChartCPService {
    List<List<String>> getSessionItems(Object sessionAttribute);

    void saveMedicalChart(MedicalChartDTO medicalChartDTO);

    MedicalChartDTO getMedicalChartByCnum(Integer cnum);

}
