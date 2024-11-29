package kroryi.his.repository;

import java.util.List;
import java.util.Optional;

import kroryi.his.domain.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long>{

    // 특정 날짜에 해당하는 예약을 조회하는 메서드
    @Query("SELECT r FROM Reservation r WHERE r.reservationDate LIKE %:date%")
    List<Reservation> findByReservationDate(@Param("date") String date);


    // 인덱스 번호에 해당하는 예약 정보를 조회하는 메서드
    List<Reservation> findBySeq(Long seq);

    void deleteById(Long seq);


    Optional<Reservation> findFirstByChartNumber(String chartNumber);

    @Query("SELECT r FROM Reservation r WHERE r.chartNumber = :chartNumber AND FUNCTION('DATE', r.reservationDate) = CURRENT_DATE")
    List<Reservation> findTodayReservationsByChartNumber(@Param("chartNumber") String chartNumber);


    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.treatmentType = '일반' AND r.reservationDate LIKE CONCAT(CURRENT_DATE, '%')")
    int getTodayGeneralPatientCount();

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.treatmentType = '수술' AND r.reservationDate LIKE CONCAT(CURRENT_DATE, '%')")
    int getTodaySurgeryCount();

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.treatmentType = '신환' AND r.reservationDate LIKE CONCAT(CURRENT_DATE, '%')")
    int getTodayNewPatientCount();

}
