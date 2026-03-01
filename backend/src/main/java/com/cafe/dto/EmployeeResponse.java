package com.cafe.dto;

import com.cafe.entity.Employee;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String roleTitle;
    private String department;
    private LocalDate joiningDate;
    private Employee.Status status;
    private LocalDateTime createdAt;
}
