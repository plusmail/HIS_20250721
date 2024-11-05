package kroryi.his.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
public class PatientStatusDTO {
    private int generalPatientCount;
    private int surgeryCount;
    private int newPatientCount;
}
