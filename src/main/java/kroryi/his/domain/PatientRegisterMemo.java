package kroryi.his.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.log4j.Log4j2;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
//@ToString(exclude = "patientRegister")
@Builder
@Getter
@Setter
@Table(name = "memo")
@Log4j2
public class PatientRegisterMemo {

    // 메모 ID (자동 증가)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mmo")
    private Long mmo;

    private String memoChartNum;

    // 등록 날짜
    @Column(name = "reg_date")
    private LocalDate regDate;

    // 내용
    @Column(name = "content", length = 1000)
    private String content;

    public void changeText(String content) {
        this.content = content;
    }
}
