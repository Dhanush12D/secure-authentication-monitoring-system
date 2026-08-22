package com.example.secureauthsystem.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.secureauthsystem.entity.LoginLog;
import com.example.secureauthsystem.entity.User;
import com.example.secureauthsystem.entity.UserSession;
import com.example.secureauthsystem.repository.LoginLogRepository;
import com.example.secureauthsystem.repository.UserRepository;
import com.example.secureauthsystem.repository.UserSessionRepository;

@Service
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final LoginLogRepository loginLogRepository;
    private final UserSessionRepository userSessionRepository;

    public AdminDashboardService(UserRepository userRepository,
                                  LoginLogRepository loginLogRepository,
                                  UserSessionRepository userSessionRepository) {
        this.userRepository = userRepository;
        this.loginLogRepository = loginLogRepository;
        this.userSessionRepository = userSessionRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<LoginLog> getAllLoginLogs() {
        return loginLogRepository.findAll();
    }

    public List<UserSession> getActiveSessions() {
        // session_status in DB: expected values contain "active"
        return userSessionRepository.findBySessionStatusIgnoreCaseContaining("active");
    }

    public List<LoginLog> getFailedLogins() {
        // status in DB: expected values contain "fail"
        return loginLogRepository.findByStatusIgnoreCaseContaining("fail");
    }
}

