package kroryi.his.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "patient_admissions", schema = "project_db")
public class PatientAdmission {
    @Id
    @Column(name = "chart_num", nullable = false)
    private Integer id;

    @Column(name = "pa_name", nullable = false, length = 20)
    private String paName;

    @Column(name = "main_doc", length = 20)
    private String mainDoc;

    @Column(name = "rv_time")
    private LocalDate rvTime;

    @Column(name = "vi_time")
    private LocalDate viTime;

    @Column(name = "treat_status", length = 100)
    private String treatStatus;

}