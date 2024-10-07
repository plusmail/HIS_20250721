package kroryi.his.service.Impl;

import kroryi.his.domain.ChartMemo;
import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.repository.ChartMemoRepository;
import kroryi.his.service.ChartService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Data
@Service
@Log4j2
@RequiredArgsConstructor
public class ChartServiceImpl implements ChartService {


    @Autowired
    private ChartMemoRepository chartMemoRepository;


    @Override
    public List<ChartMemo> getAllMedicalCharts() {
        return chartMemoRepository.findAll();
    }
    @Override
    public MedicalChartDTO setChart(int id) {
        return null;
    }

    @Override
    // 새로운 메모를 저장
    public ChartMemo saveMemo(ChartMemo newMemo) {
        return chartMemoRepository.save(newMemo);  // 메모를 데이터베이스에 저장
    }

}
