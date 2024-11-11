package kroryi.his.mapper;

import kroryi.his.domain.MedicalChart;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;

public class MedicalChartRowMapper implements RowMapper<MedicalChart> {
    @Override
    public MedicalChart mapRow(ResultSet rs, int rowNum) throws SQLException {
        // MedicalChart 객체 생성
        MedicalChart medicalChart = new MedicalChart();

        // 데이터베이스의 각 열을 MedicalChart 객체의 필드에 매핑
        medicalChart.setCnum(rs.getInt("cnum"));
        medicalChart.setChartNum(rs.getString("chart_num"));
        medicalChart.setCheckDoc(rs.getString("check_doc"));
        // mdTime 필드: LocalDate로 변환하여 시간 제외
        medicalChart.setMdTime(rs.getTimestamp("md_time").toLocalDateTime().toLocalDate());
        medicalChart.setMedicalContent(rs.getString("medical_content"));
        medicalChart.setMedicalDivision(rs.getString("medical_division"));
        medicalChart.setPaName(rs.getString("pa_name"));
        medicalChart.setTeethNum(rs.getString("teeth_num"));

        return medicalChart;  // 매핑된 MedicalChart 객체 반환
    }
}