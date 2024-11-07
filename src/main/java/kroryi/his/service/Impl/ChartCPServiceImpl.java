package kroryi.his.service.Impl;

import kroryi.his.domain.MedicalChart;
import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.repository.MedicalChartRepository;
import kroryi.his.service.ChartCPService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Log4j2
@Service
@RequiredArgsConstructor
public class ChartCPServiceImpl implements ChartCPService {

    private final MedicalChartRepository medicalChartRepository;

    private List<List<String>> toothList = new ArrayList<>();
    private List<List<String>> symptomList = new ArrayList<>();
    private List<List<String>> memoList = new ArrayList<>();
    private List<List<String>> arrayList = new ArrayList<>();
    private List<List<String>> piList = new ArrayList<>();
    private List<List<String>> dbSaveList;

    private int controllerListIndex = 0;


    @Override
    public List<List<String>> getSessionItems(Object sessionAttribute) {
        List<List<String>> sessionList = (List<List<String>>) sessionAttribute;
        if (sessionList == null) {
            sessionList = new ArrayList<>();
            for (int i = 0; i < 4; i++) sessionList.add(new ArrayList<>());
        }
        if (piList == null) piList = new ArrayList<>();
        log.info("piList get -----> {}", piList);
        return piList;
    }

    @Override
    public void saveMedicalChart(MedicalChartDTO medicalChartDTO) {
        MedicalChart medicalChart = MedicalChart.builder()
                .mdTime(medicalChartDTO.getMdTime())
                .checkDoc(medicalChartDTO.getCheckDoc())
                .medicalContent(medicalChartDTO.getMedicalContent())
                .teethNum(medicalChartDTO.getTeethNum())
                .medicalDivision(medicalChartDTO.getMedicalDivision())
                .chartNum(medicalChartDTO.getChartNum())
                .paName(medicalChartDTO.getPaName())
                .build();

        medicalChartRepository.save(medicalChart);
    }
}
