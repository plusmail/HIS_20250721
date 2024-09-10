package kroryi.his.domain;

import groovyjarjarantlr4.v4.runtime.misc.NotNull;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Getter
@Setter
@Table(name = "patient_reg")
public class PatientRegister {

    // 차트번호
    @Id
    @Column(name = "chart_num")
    private String chartNum;

    // 환자이름
    @NotNull
    @Column(name = "pa_name", length = 100)
    private String name;

    // 주민번호
    @NotNull
    @Column(name = "pa_reident_num", length = 30)
    private String reidentNum;

    // 성별
    @NotNull
    @Column(name = "pa_gender")
    private String gender;

    // 자택번호
    @Column(name = "pa_home_num")
    private String homeNum;

    // 휴대전화
    @NotNull
    @Column(name = "pa_phone_num")
    private String phoneNum;

    // 이메일
    @Column(name = "pa_email")
    private String email;

    // 기본주소
    @Column(name = "defult_address")
    private String defultAddress;

    //상세주소
    @Column(name = "detailed_address")
    private String detailedAddress;

    // 주치의
    @NotNull
    @Column(name = "main_doc")
    private String mainDoc;

    //치위생사
    @Column(name = "dental_hygienist")
    private String dentalHygienist;

    //내원유형
    @Column(name = "visit_path")
    private String visitPath;

    //고객유형
    @Column(name = "pa_category")
    private String category;

    //성향
    @Column(name = "pa_tendency")
    private String tendency;

    //최초내원일
    @Column(name = "first_visit")
    private String firstVisit;

    //최종내원일
    @Column(name = "last_visit")
    private String lastVisit;
}
