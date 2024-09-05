package kroryi.his.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "employees", schema = "project_db")
public class Employee {
    @Id
    @Column(name = "EmployeeID", nullable = false, length = 10)
    private String employeeID;

    @Column(name = "name", nullable = false, length = 20)
    private String name;

    @Column(name = "first_resident", nullable = false, length = 6)
    private String firstResident;

    @Column(name = "last_resident", nullable = false, length = 7)
    private String lastResident;

    @Column(name = "division", nullable = false, length = 10)
    private String division;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @Column(name = "addr", nullable = false, length = 30)
    private String addr;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(name = "license_num", length = 10)
    private String licenseNum;

    @Column(name = "leave_date")
    private LocalDate leaveDate;

    @Column(name = "phone", nullable = false, length = 11)
    private String phone;

    @Column(name = "gender", length = 5)
    private String gender;

    @Column(name = "emp_status", length = 10)
    private String empStatus;

    @OneToMany(mappedBy = "checkDoc")
    private Set<MedicalChart> medicalCharts = new LinkedHashSet<>();

}