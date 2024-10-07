package kroryi.his.service;


import kroryi.his.domain.ChartMemo;
import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.repository.ChartMemoRepository;
import kroryi.his.repository.MedicalChartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ChartService {

    ChartMemo saveMemo(ChartMemo memo);

    List<ChartMemo> getAllMedicalCharts();

    MedicalChartDTO setChart(int id);


}
