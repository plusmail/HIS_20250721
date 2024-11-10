package kroryi.his.service.Impl;

import jakarta.persistence.EntityNotFoundException;
import kroryi.his.domain.MedicalChart;
import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.repository.MedicalChartRepository;
import kroryi.his.service.ChartCPService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Log4j2
@Service
@RequiredArgsConstructor
public class ChartCPServiceImpl implements ChartCPService {

    private final MedicalChartRepository medicalChartRepository;

    private final ModelMapper modelMapper;

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
        MedicalChart medicalChart;
        if (medicalChartDTO.getCnum() != null) {
            // cnum  값 존재시 기존 데이터 수정
            medicalChart = medicalChartRepository.findByCnum(medicalChartDTO.getCnum());
            if (medicalChart != null) {
                medicalChart.setMdTime(medicalChartDTO.getMdTime());
                medicalChart.setCheckDoc(medicalChartDTO.getCheckDoc());
                medicalChart.setMedicalContent(medicalChartDTO.getMedicalContent());
                medicalChart.setTeethNum(medicalChartDTO.getTeethNum());
                medicalChart.setMedicalDivision(medicalChartDTO.getMedicalDivision());
                medicalChart.setChartNum(medicalChartDTO.getChartNum());
                medicalChart.setPaName(medicalChartDTO.getPaName());
            } else {
                throw new IllegalArgumentException("유효하지 않은 cnum: " + medicalChartDTO.getCnum());
            }
        } else {
            // 새 데이터 생성
            medicalChart = MedicalChart.builder()
                    .mdTime(medicalChartDTO.getMdTime())
                    .checkDoc(medicalChartDTO.getCheckDoc())
                    .medicalContent(medicalChartDTO.getMedicalContent())
                    .teethNum(medicalChartDTO.getTeethNum())
                    .medicalDivision(medicalChartDTO.getMedicalDivision())
                    .chartNum(medicalChartDTO.getChartNum())
                    .paName(medicalChartDTO.getPaName())
                    .build();
        }
        medicalChartRepository.save(medicalChart);
    }

    @Override
    public MedicalChartDTO getMedicalChartByCnum(Integer cnum) {
        MedicalChart medicalChart = medicalChartRepository.findByCnum(cnum);
        if (medicalChart != null) {
            return modelMapper.map(medicalChart, MedicalChartDTO.class);
        }
        return null;
    }

}
