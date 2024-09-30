package kroryi.his.service.Impl;

import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.service.ChartService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@Log4j2
@RequiredArgsConstructor
public class ChartImpl implements ChartService {


    @Override
    public MedicalChartDTO setChart(int id) {
        return null;
    }
}
