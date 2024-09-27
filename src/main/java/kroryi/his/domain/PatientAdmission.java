package kroryi.his.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "patient_admissions", schema = "project_db")
public class PatientAdmission {
    @Id
    @Column(name = "chart_num", nullable = false)
    private Integer chartNum;

    @Column(name = "pa_name", nullable = false, length = 20)
    private String paName;

    @Column(name = "main_doc", length = 20)
    private String mainDoc;

    @Column(name = "rv_time")
    private LocalDateTime receptionTime;

    @Column(name = "ap_time")
    private LocalDateTime appointmentTime;

    @Column(name = "ts_time")
    private LocalDateTime treatmentStartTime;

    @Column(name = "vi_time")
    private LocalDateTime completionTime;

    @Column(name = "treat_status", length = 100)
    private String treatStatus;

}