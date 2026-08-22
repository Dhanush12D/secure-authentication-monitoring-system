package com.example.secureauthsystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.secureauthsystem.entity.LoginLog;

@Repository
public interface LoginLogRepository extends JpaRepository<LoginLog, Long> {

    List<LoginLog> findTop10ByOrderByLoginTimeDesc();

    long countByStatusIgnoreCaseContaining(String statusFragment);

    List<LoginLog> findByStatusIgnoreCaseContaining(String statusFragment);
}



