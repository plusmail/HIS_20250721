package kroryi.his.service;


import kroryi.his.dto.MedicalChartDTO;
import org.springframework.stereotype.Service;

@Service
public interface ChartService {

    MedicalChartDTO setChart(int id);


}
