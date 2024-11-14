package kroryi.his.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "reservation")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seq")
    private long seq;

    @Column(name = "reservation_date")
    private String reservationDate;

    @Column(name = "name")
    private String name;

    @Column(name = "sns_notification")
    private boolean snsNotification;

    @Column(name = "chart_number")
    private String chartNumber;

    @Column(name = "doctor")
    private String doctor;

    @Column(name = "treatment_type")
    private String treatmentType;

    @Column(name = "patient_note")
    private String patientNote;

    @Column(name = "reservation_status_check")
    private String reservationStatusCheck;

    public Reservation() {
        super();

    }

    public Reservation(long seq, String reservationDate,
                       String name, boolean snsNotification, String chartNumber, String doctor, String treatmentType, String patientNote,
                       String reservationStatusCheck) {
        super();
        this.seq = seq;
        this.reservationDate = reservationDate;
        this.name = name;
        this.snsNotification = snsNotification;
        this.chartNumber = chartNumber;
        this.doctor = doctor;
        this.treatmentType = treatmentType;
        this.patientNote = patientNote;
        this.reservationStatusCheck = reservationStatusCheck;
    }
}