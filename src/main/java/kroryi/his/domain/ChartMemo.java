package kroryi.his.domain;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "chart_memo")
public class ChartMemo {

    @Id
    String memo;

    String doc;
}
