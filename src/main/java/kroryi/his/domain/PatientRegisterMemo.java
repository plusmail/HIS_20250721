package kroryi.his.domain;


import jakarta.persistence.*;
import lombok.*;
import lombok.extern.log4j.Log4j2;


import java.time.LocalDate;

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

//    // 차트번호 (PatientRegister와 연결)
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "memo_chartnum", referencedColumnName = "chart_num", nullable = false)
//    private PatientRegister patientRegister;

    // 등록 날짜
    @Column(name = "reg_date")
    private LocalDate regDate;

    // 내용
    @Column(name = "content", length = 1000)
    private String content;

    public void changeText(String content) {
        this.content = content;
    }

    // 기타 필드
    // 필요한 경우 여기에 추가 필드를 정의할 수 있습니다.
}
