package com.example.secureauthsystem.security;

import java.io.IOException;
import java.util.Optional;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.example.secureauthsystem.service.LoginLogService;

public class LoginSuccessFailureHandlers {

    public static class SuccessHandler implements AuthenticationSuccessHandler {

        private final LoginLogService loginLogService;

        public SuccessHandler(LoginLogService loginLogService) {
            this.loginLogService = loginLogService;
        }

        @Override
        public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                Authentication authentication) throws IOException, ServletException {

            String email = authentication.getName();
            String ip = resolveClientIp(request);

            loginLogService.saveLoginAttempt(email, ip, "SUCCESS");

            // let Spring continue with its configured successUrl
        }
    }

    public static class FailureHandler implements AuthenticationFailureHandler {

        private final LoginLogService loginLogService;

        public FailureHandler(LoginLogService loginLogService) {
            this.loginLogService = loginLogService;
        }

        @Override
        public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                org.springframework.security.core.AuthenticationException exception)
                throws IOException, ServletException {

            // formLogin uses parameter name 'username' and 'password'.
            // In this project, the email is posted as username.
            String email = Optional.ofNullable(request.getParameter("username")).orElse("UNKNOWN");
            email = email == null ? "UNKNOWN" : email.trim();
            String ip = resolveClientIp(request);

            // Requirement: record FAILED on any authentication failure.
            loginLogService.saveLoginAttempt(email, ip, "FAILED");


            // let Spring continue with its configured failureUrl
        }
    }

    private static String resolveClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}

