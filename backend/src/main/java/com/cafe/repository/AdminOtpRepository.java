package com.cafe.repository;

import com.cafe.entity.AdminOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminOtpRepository extends JpaRepository<AdminOtp, Long> {
    Optional<AdminOtp> findTopByEmailAndCodeAndUsedFalseOrderByCreatedAtDesc(String email, String code);
}
