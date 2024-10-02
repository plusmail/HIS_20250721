package kroryi.his.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "medical_chart", schema = "project_db")
public class MedicalChart {

    @Column(name = "chart_num", nullable = false)
    private Integer id;

    @Id
    @Column(name = "cnum", nullable = false)
    private Integer cnum;

    @Column(name = "pa_name", nullable = false, length = 20)
    private String paName;

    @Column(name = "md_time", nullable = false)
    private LocalDate mdTime;

    @Column(name = "medical_division", nullable = false, length = 20)
    private String medicalDivision;

    @Column(name = "teeth_num", length = 100)
    private String teethNum;


    @Column(name = "medical_content", nullable = false)
    private String medicalContent;

    @Column(name = "check_doc")
    private String checkDoc;
}