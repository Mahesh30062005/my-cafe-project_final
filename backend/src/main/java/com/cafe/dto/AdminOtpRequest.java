package com.cafe.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminOtpRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email")
    private String email;
}
