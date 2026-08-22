package com.example.secureauthsystem.service;

import java.time.Instant;

import org.springframework.stereotype.Service;

import com.example.secureauthsystem.entity.LoginLog;
import com.example.secureauthsystem.repository.LoginLogRepository;

@Service
public class LoginLogService {

    private final LoginLogRepository loginLogRepository;

    public LoginLogService(LoginLogRepository loginLogRepository) {
        this.loginLogRepository = loginLogRepository;
    }

    public void saveLoginAttempt(String email, String ipAddress, String status) {
        LoginLog log = new LoginLog();
        log.setEmail(email);
        log.setIpAddress(ipAddress);
        log.setStatus(status);
        log.setLoginTime(Instant.now());
        loginLogRepository.save(log);
    }
}

