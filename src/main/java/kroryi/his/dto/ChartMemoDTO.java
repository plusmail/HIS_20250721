package kroryi.his.dto;


import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.io.Serializable;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChartMemoDTO implements Serializable {

   private String memo;
   private String doc;
}
