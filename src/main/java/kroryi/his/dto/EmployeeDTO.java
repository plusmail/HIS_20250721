package kroryi.his.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for {@link kroryi.his.domain.Employee}
 */

@Builder
@Data
@AllArgsConstructor
public class EmployeeDTO implements Serializable {
    private String employeeID;
    private String name;
    private String firstResident;
    private String lastResident;
    private String division;
    private LocalDate hireDate;
    private String addr;
    private LocalDate birthDate;
    private String licenseNum;
    private LocalDate leaveDate;
    private String phone;
    private String gender;
    private String empStatus;
}