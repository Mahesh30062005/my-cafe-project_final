package com.cafe.service;

import com.cafe.dto.EmployeeRequest;
import com.cafe.dto.EmployeeResponse;
import com.cafe.entity.Employee;
import com.cafe.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Transactional
    public EmployeeResponse create(EmployeeRequest request) {
        Employee employee = Employee.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .roleTitle(request.getRoleTitle())
                .department(request.getDepartment())
                .joiningDate(request.getJoiningDate())
                .status(request.getStatus())
                .build();

        Employee saved = employeeRepository.save(employee);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> list() {
        return employeeRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new IllegalArgumentException("Employee not found");
        }
        employeeRepository.deleteById(id);
    }

    private EmployeeResponse toResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .fullName(employee.getFullName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .roleTitle(employee.getRoleTitle())
                .department(employee.getDepartment())
                .joiningDate(employee.getJoiningDate())
                .status(employee.getStatus())
                .createdAt(employee.getCreatedAt())
                .build();
    }
}
