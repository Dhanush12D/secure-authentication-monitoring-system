package com.example.secureauthsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.secureauthsystem.entity.SecurityAlert;

@Repository
public interface SecurityAlertRepository extends JpaRepository<SecurityAlert, Long> {
}

