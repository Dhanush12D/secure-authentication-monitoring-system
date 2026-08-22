package com.example.secureauthsystem.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.secureauthsystem.service.DashboardService;

@Controller
public class DashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        Map<String, Object> data = dashboardService.getDashboardModel();
        data.forEach(model::addAttribute);

        // Expose JSON strings for safe JS parsing (Chart.js datasets are simple lists already)
        model.addAttribute("activityJson", data.get("activity"));
        model.addAttribute("threatsJson", data.get("threats"));


        return "dashboard";
    }
}

