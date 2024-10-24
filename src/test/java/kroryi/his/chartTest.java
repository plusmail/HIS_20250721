package kroryi.his;

import kroryi.his.domain.ChartMemo;
import kroryi.his.domain.MedicalChart;
import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.repository.ChartMemoRepository;
import kroryi.his.repository.MedicalChartRepository;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@SpringBootTest
@Log4j2
public class chartTest {

    @Autowired
    private ChartMemoRepository memoRepo;

    @Autowired
    private MedicalChartRepository medicalRepo;

    @Test
    public void test() {

        List<ChartMemo> memos = memoRepo.findAll();
        for (ChartMemo memo : memos) {

            log.info("memos memo ----> {}", memo.getMemo());
            log.info("memos doc -----> {}", memo.getDoc());
        }
    }

    @Test
    public void addChartTest() {
        // Given: DataEntity 객체 생성
        MedicalChart entity = MedicalChart.builder()
                .teethNum("a123,a456,a789")
                .medicalDivision("b123,b456,b789")
                .medicalContent("c123,c456,c789")
                .mdTime(LocalDate.now())
                .chartNum("20240911")
                .checkDoc("의사")
                .paName("김복순")
                .build();

        // When: 데이터 저장
        MedicalChart savedEntity = medicalRepo.save(entity);

    }

    @Test
    public void researchChartTest() {
        List<MedicalChart> memos = medicalRepo.findMedicalChartByChartNum("2024111122");
        for (MedicalChart memo : memos) {
            log.info(memo.getChartNum());
            log.info(memo.getCheckDoc());
            log.info(memo.getPaName());
            log.info(memo.getMedicalContent());
        }
    }

    @Test
    public void deleteChartTest(){
       medicalRepo
                .deleteByChartNumAndPaNameAndTeethNumAndMedicalDivisionAndMdTime("240912043",
                        "김유신",
                        "28,41",
                        "레진",
                        LocalDate.ofEpochDay((2024-10-22)));
    }

    @Test
    public void findData(){
        List<MedicalChart> records = medicalRepo.findByChartNumAndPaNameAndTeethNumAndMedicalDivisionAndMdTime(
                "240912043",
                "김유신",
                "28, 41",
                "레진",
                LocalDate.of(2024,10,22)
        );


        if (records.isEmpty()) {
            System.out.println("No matching records found");
        } else {
            System.out.println("Found records: " + records.size());
            medicalRepo.deleteByChartNumAndPaNameAndTeethNumAndMedicalDivisionAndMdTime(
                    "240912043",
                    "김유신",
                    "28,41",
                    "레진",
                    LocalDate.ofEpochDay((2024-10-22)));

            System.out.println("Records deleted");
        }
    }

}

