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
    @Id
    @Column(name = "chart_num", nullable = false)
    private Integer id;

    @Column(name = "pa_name", nullable = false, length = 20)
    private String paName;

    @Column(name = "md_time", nullable = false)
    private LocalDate mdTime;

    @Column(name = "medical_division", nullable = false, length = 20)
    private String medicalDivision;

    @Column(name = "teeth_num", length = 100)
    private String teethNum;

    @Lob
    @Column(name = "medical_content", nullable = false)
    private String medicalContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "check_doc", nullable = false, referencedColumnName = "employeeID")
    private Employee checkDoc;

}