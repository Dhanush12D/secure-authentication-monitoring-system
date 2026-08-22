package com.example.secureauthsystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.secureauthsystem.service.AdminDashboardService;

@Controller
public class AdminRoutesController {

    private final AdminDashboardService adminDashboardService;

    public AdminRoutesController(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping("/users")
    public String users(Model model) {
        model.addAttribute("users", adminDashboardService.getAllUsers());
        return "users";
    }

    @GetMapping("/login-logs")
    public String loginLogs(Model model) {
        model.addAttribute("loginLogs", adminDashboardService.getAllLoginLogs());
        return "login-logs";
    }

    @GetMapping("/sessions")
    public String sessions(Model model) {
        model.addAttribute("sessions", adminDashboardService.getActiveSessions());
        return "sessions";
    }

    @GetMapping("/failed-logins")
    public String failedLogins(Model model) {
        model.addAttribute("failedLogins", adminDashboardService.getFailedLogins());
        return "failed-logins";
    }
}

