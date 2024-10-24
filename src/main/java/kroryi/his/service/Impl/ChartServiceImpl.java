package kroryi.his.service.Impl;

import kroryi.his.domain.ChartMemo;
import kroryi.his.domain.MedicalChart;
import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.repository.ChartMemoRepository;
import kroryi.his.repository.MedicalChartRepository;
import kroryi.his.service.ChartService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Data
@Service
@Log4j2
@RequiredArgsConstructor
public class ChartServiceImpl implements ChartService {


    @Autowired
    private ChartMemoRepository chartMemoRepository;

    @Autowired
    private MedicalChartRepository medicalChartRepository;


    @Override
    public List<ChartMemo> getAllMedicalChartsMemo() {
        return chartMemoRepository.findAll();
    }
    @Override
    public List<MedicalChart> getChart(String chartNum) {
        return medicalChartRepository.findMedicalChartByChartNum(chartNum);
    }


    @Override
    public MedicalChartDTO addMedicalChart(MedicalChartDTO dto) {

        List<List<String>> piList = dto.getChartData();

        if (piList == null || piList.isEmpty()) {
            return null; // 데이터가 없으면 리턴
        }
        // 1. 첫 번째 리스트의 데이터를 aColumn에 저장
        String toothNum = piList.get(0).stream().collect(Collectors.joining(","));

        // 2. 두 번째 리스트의 데이터를 bColumn에 저장 (존재하는 경우)
        String medicalDivision = piList.size() > 1 ? piList.get(1).stream().collect(Collectors.joining(",")) : null;

        // 3. 세 번째 리스트의 데이터를 cColumn에 저장 (존재하는 경우)
        String medicalContent = piList.size() > 2 ? piList.get(2).stream().collect(Collectors.joining(",")) : null;


        // 데이터를 3개씩 묶어서 저장하기
        for (int i = 0; i < piList.size(); i += 3) {
            MedicalChart entity = MedicalChart.builder()
                    .teethNum(toothNum)
                    .medicalDivision(medicalDivision)
                    .medicalContent(medicalContent)
//                    .teethNum(i < piList.size() && piList.get(i).size() > 0 ? piList.get(i).get(0) : null)
//                    .medicalDivision(i + 1 < piList.size() && piList.get(i + 1).size() > 0 ? piList.get(i + 1).get(0) : null)
//                    .medicalContent(i + 2 < piList.size() && piList.get(i + 2).size() > 0 ? piList.get(i + 2).get(0) : null)
                    .mdTime(LocalDate.now())
                    .chartNum(dto.getChartNum())
                    .checkDoc("의사")
                    .paName(dto.getPaName())
                    .build();

            // 데이터베이스에 저장
            medicalChartRepository.save(entity);
        }

        return null;
    }

    @Override
    public MedicalChartDTO addMedicalChart(List<List<String>> piList, String paName, String chartNum) {


        if (piList == null || piList.isEmpty()) {
            return null; // 데이터가 없으면 리턴
        }
        // 1. 첫 번째 리스트의 데이터를 aColumn에 저장
        String toothNum = piList.get(0).stream().collect(Collectors.joining(","));

        // 2. 두 번째 리스트의 데이터를 bColumn에 저장 (존재하는 경우)
        String medicalDivision = piList.size() > 1 ? piList.get(1).stream().collect(Collectors.joining(",")) : null;

        // 3. 세 번째 리스트의 데이터를 cColumn에 저장 (존재하는 경우)
        String medicalContent = piList.size() > 2 ? piList.get(2).stream().collect(Collectors.joining(",")) : null;


        MedicalChart entity = MedicalChart.builder()
                .teethNum(toothNum)
                .medicalDivision(medicalDivision)
                .medicalContent(medicalContent)
                .mdTime(LocalDate.now())
                .chartNum(chartNum)
                .checkDoc("의사")
                .paName(paName)
                .build();

        // 데이터베이스에 저장
        medicalChartRepository.save(entity);


        return null;
    }

    @Override
    public MedicalChartDTO addMedicalChart(String teethNum, String plan, String chartNum, String paName) {

        MedicalChart chartPlan = MedicalChart.builder()
                .teethNum(teethNum)
                .medicalDivision(plan)
                .mdTime(LocalDate.now())
                .medicalContent("")
                .checkDoc("의사")
                .paName(paName)
                .chartNum(chartNum)
                .build();

        medicalChartRepository.save(chartPlan);
        return null;
    }

    @Override
    public MedicalChartDTO deleteChart(String charNum, String paName, String teethNum, String medicalDivision) {

        LocalDate today = LocalDate.now();
        log.info("deleteChart 시작");
        log.info("chartNum: '{}'", charNum);
        log.info("paName: '{}'", paName);
        log.info("teethNum: '{}'", teethNum);
        log.info("medicalDivision: '{}'", medicalDivision);
        log.info("-----------------------");
        log.info("chartNum ---->{}", Objects.equals(charNum,"240912043"));
        log.info("paName --->{}", Objects.equals(paName, "김유신"));
        log.info("teethNum ---->{}", Objects.equals(teethNum, "11, 28"));
        log.info("medicalDivision ---->{}", Objects.equals(medicalDivision, "레진"));
        int year = today.getYear();     // 연도
        int month = today.getMonthValue();  // 월
        int day = today.getDayOfMonth();   // 일

        LocalDate localDate = LocalDate.of(year, month, day);
        log.info("localDate --->{}", localDate.equals(LocalDate.of(2024,10,22)));

        log.info("1111111111-{}", charNum);
        medicalChartRepository.deleteByChartNumAndPaNameAndTeethNumAndMedicalDivisionAndMdTime(charNum,paName,teethNum,medicalDivision,today);
        log.info("deleteChart 실행");
        return null;
    }

    @Override
    // 새로운 메모를 저장
    public ChartMemo saveMemo(ChartMemo newMemo) {
        return chartMemoRepository.save(newMemo);  // 메모를 데이터베이스에 저장
    }

}
