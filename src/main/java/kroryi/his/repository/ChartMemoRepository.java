package kroryi.his.repository;

import kroryi.his.domain.ChartMemo;
import lombok.Data;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ChartMemoRepository extends JpaRepository<ChartMemo, Integer> {

}
