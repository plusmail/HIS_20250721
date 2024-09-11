package kroryi.his.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "patients", schema = "project_db")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chart_num", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chart_num", nullable = false)
    private MedicalChart medicalChart;

    @Column(name = "pa_photo", length = 100)
    private String paPhoto;

    @Column(name = "pa_foreign_check", nullable = false, length = 5)
    private String paForeignCheck;

    @Column(name = "pa_name", nullable = false, length = 20)
    private String paName;

    @Column(name = "first_pa_resident_num", nullable = false, length = 6)
    private String firstPaResidentNum;

    @Column(name = "last_pa_resident_num", nullable = false, length = 7)
    private String lastPaResidentNum;

    @Column(name = "pa_gender", length = 5)
    private String paGender;

    @Column(name = "pa_phone_num", length = 13)
    private String paPhoneNum;

    @Column(name = "pa_email", length = 50)
    private String paEmail;

    @Column(name = "main_doc", length = 20)
    private String mainDoc;

    @Column(name = "visit_path", length = 10)
    private String visitPath;

    @Column(name = "pa_category", length = 20)
    private String paCategory;

    @Lob
    @Column(name = "pa_tendency")
    private String paTendency;

    @Column(name = "first_visit")
    private LocalDate firstVisit;

    @Column(name = "last_visit")
    private LocalDate lastVisit;

}