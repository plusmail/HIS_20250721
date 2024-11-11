package kroryi.his.service.Impl;

import jakarta.persistence.criteria.Predicate;
import kroryi.his.domain.ChartMemo;
import kroryi.his.domain.MedicalChart;
import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.dto.MedicalChartSearchDTO;
import kroryi.his.mapper.MedicalChartRowMapper;
import kroryi.his.repository.ChartMemoRepository;
import kroryi.his.repository.MedicalChartRepository;
import kroryi.his.service.ChartService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Data
@Service
@Log4j2
@RequiredArgsConstructor
public class ChartServiceImpl implements ChartService {

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    private ChartMemoRepository chartMemoRepository;

    @Autowired
    private MedicalChartRepository medicalChartRepository;

//    public List<MedicalChart> searchMedicalCharts(MedicalChartSearchDTO medicalChartSearchDTO) {
//        return medicalChartRepository.searchMedicalCharts(
//                medicalChartSearchDTO.getChartNum(),
//                medicalChartSearchDTO.getMdTimeStart(),
//                medicalChartSearchDTO.getMdTimeEnd(),
//                medicalChartSearchDTO.getCheckDoc(),
//                medicalChartSearchDTO.getMedicalDivision(),
//                medicalChartSearchDTO.getTeethNum().toString()
//        );
//    }

    public Specification<MedicalChart> createTeethNumSpecification(MedicalChartSearchDTO searchDTO) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            // chartNum 조건
            if (searchDTO.getChartNum() != null && !searchDTO.getChartNum().isEmpty()) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("chartNum"), searchDTO.getChartNum()));
            }

            // mdTime 조건 (시작일자와 종료일자 사이 값)
            LocalDate mdTimeStart = searchDTO.getMdTimeStart();
            LocalDate mdTimeEnd = searchDTO.getMdTimeEnd();

            if (mdTimeStart != null && mdTimeEnd == null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.greaterThanOrEqualTo(root.get("mdTime"), mdTimeStart.atStartOfDay()));
            } else if (mdTimeStart == null && mdTimeEnd != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.lessThanOrEqualTo(root.get("mdTime"), mdTimeEnd.atTime(23, 59, 59)));
            } else if (mdTimeStart != null && mdTimeEnd != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.between(root.get("mdTime"), mdTimeStart.atStartOfDay(), mdTimeEnd.atTime(23, 59, 59)));
            }

            // teethNums 조건 (LIKE 연산자 사용)
            List<String> teethNums = searchDTO.getTeethNum();
            if (teethNums != null && !teethNums.isEmpty()) {
                List<Predicate> teethNumPredicates = new ArrayList<>();
                for (String teethNum : teethNums) {
                    teethNumPredicates.add(criteriaBuilder.like(root.get("teethNum"), "%" + teethNum + "%"));
                }
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.or(teethNumPredicates.toArray(new Predicate[0])));
            }

            // checkDoc 조건 (대소문자 구분 없이 비교)
            String checkDoc = searchDTO.getCheckDoc();
            if (checkDoc != null && !checkDoc.isEmpty()) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(criteriaBuilder.lower(root.get("checkDoc")), checkDoc.toLowerCase()));
            }

            // medicalDivision 조건
            String medicalDivision = searchDTO.getMedicalDivision();
            if (medicalDivision != null && !medicalDivision.isEmpty()) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("medicalDivision"), medicalDivision));
            }

            // keyword 조건 - medicalContent 필드에서 keyword로 부분 검색
            String keyword = searchDTO.getKeyword();
            if (keyword != null && !keyword.isEmpty()) { // keyword가 존재할 때만 조건 추가
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.like(root.get("medicalContent"), "%" + keyword + "%"));
            }

            // 정렬 추가 - mdTime 기준 내림차순
            query.orderBy(criteriaBuilder.asc(root.get("mdTime")));

            return predicate;
        };
    }


    public List<MedicalChart> searchMedicalCharts(MedicalChartSearchDTO searchDTO) {
        Specification<MedicalChart> spec = createTeethNumSpecification(searchDTO);
        return medicalChartRepository.findAll(spec);
    }


    public List<MedicalChart> searchMedicalCharts(String chartNum, List<String> teethNums) {
        StringBuilder queryBuilder = new StringBuilder("SELECT DISTINCT * FROM medical_chart m WHERE m.chart_num = :chartNum ");

        // 기본 파라미터 설정
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("chartNum", chartNum);

        // teethNums 리스트의 각 요소에 대해 LIKE 조건 추가
        if (teethNums != null && !teethNums.isEmpty()) {
            queryBuilder.append(" AND (");
            for (int i = 0; i < teethNums.size(); i++) {
                String teethNumParam = "teethNum" + i;
                queryBuilder.append("m.teeth_num LIKE CONCAT('%', :").append(teethNumParam).append(", '%')");
                parameters.addValue(teethNumParam, teethNums.get(i));

                if (i < teethNums.size() - 1) {
                    queryBuilder.append(" OR ");
                }
            }
            queryBuilder.append(")");
        }

        // 쿼리 실행
        return namedParameterJdbcTemplate.query(queryBuilder.toString(), parameters, new MedicalChartRowMapper());
    }


    @Override
    public List<ChartMemo> getAllMedicalChartsMemo() {
        return chartMemoRepository.findAll();
    }

    @Override
    public List<MedicalChart> getChart(String chartNum) {
        return medicalChartRepository.findMedicalChartByChartNumOrderByMdTimeAsc(chartNum);
    }

    @Override
    public List<MedicalChart> PLANChart(String chartNum, String medicalDivision) {
        return medicalChartRepository.findMedicalChartByChartNumAndMedicalDivision(chartNum, medicalDivision);
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
    public MedicalChartDTO MedicalChartSave(MedicalChartDTO dto) {
        MedicalChart chartPlan = MedicalChart.builder()
                .teethNum(dto.getTeethNum())
                .medicalDivision(dto.getMedicalDivision())
                .mdTime(dto.getMdTime())
                .medicalContent(dto.getMedicalContent())
                .checkDoc(dto.getCheckDoc())
                .paName(dto.getPaName())
                .chartNum(dto.getChartNum())
                .build();

        medicalChartRepository.save(chartPlan);
        return null;
    }

    @Override
    public MedicalChart MedicalChartUpdate(MedicalChartDTO dto) {
        Optional<MedicalChart> medicalChartOptional = medicalChartRepository.findById(dto.getCnum());

        MedicalChart medicalChart = medicalChartOptional.orElseThrow();

        // 기존 객체의 필드를 수정
        medicalChart.setTeethNum(dto.getTeethNum());
        medicalChart.setMdTime(dto.getMdTime());
        medicalChart.setMedicalContent(dto.getMedicalContent());
        medicalChart.setCheckDoc(dto.getCheckDoc());


        return medicalChartRepository.save(medicalChart);
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
        log.info("chartNum ---->{}", Objects.equals(charNum, "240912043"));
        log.info("paName --->{}", Objects.equals(paName, "김유신"));
        log.info("teethNum ---->{}", Objects.equals(teethNum, "11, 28"));
        log.info("medicalDivision ---->{}", Objects.equals(medicalDivision, "레진"));
        int year = today.getYear();     // 연도
        int month = today.getMonthValue();  // 월
        int day = today.getDayOfMonth();   // 일

        LocalDate localDate = LocalDate.of(year, month, day);
        log.info("localDate --->{}", localDate.equals(LocalDate.of(2024, 10, 22)));

        log.info("1111111111-{}", charNum);
        medicalChartRepository.deleteByChartNumAndPaNameAndTeethNumAndMedicalDivisionAndMdTime(charNum, paName, teethNum, medicalDivision, today);
        log.info("deleteChart 실행");
        return null;
    }

    @Override
    // 새로운 메모를 저장
    public ChartMemo saveMemo(ChartMemo newMemo) {
        return chartMemoRepository.save(newMemo);  // 메모를 데이터베이스에 저장
    }

    @Override
    @Transactional
    public void deleteChart(Integer cnum) {
        try {
            medicalChartRepository.deleteByCnum(cnum);
        } catch (Exception e) {
            log.error("삭제 중 오류 발생: ", e);
            throw new RuntimeException("삭제에 실패했습니다.");
        }
    }

}
