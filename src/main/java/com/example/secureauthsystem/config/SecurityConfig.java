package com.example.secureauthsystem.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.example.secureauthsystem.security.LoginSuccessFailureHandlers;
import com.example.secureauthsystem.service.LoginLogService;
import com.example.secureauthsystem.service.CustomUserDetailsService;


@Configuration
public class SecurityConfig {

    @Bean
    public UserDetailsService userDetailsService() {

        return new CustomUserDetailsService();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider authProvider =
                new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService());

        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
public CommandLineRunner generatePasswordHash(BCryptPasswordEncoder encoder) {
    return args -> {
        System.out.println("HASH = " + encoder.encode("Test@123"));
    };
}

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, LoginLogService loginLogService)
            throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                .requestMatchers(
                        "/register",
                        "/login",
                        "/images/**",
                        "/css/**",
                        "/js/**"
                ).permitAll()

                .anyRequest().authenticated()
            )

            .formLogin(form -> form

                .loginPage("/login")

                .loginProcessingUrl("/login")

                .successHandler(new LoginSuccessFailureHandlers.SuccessHandler(loginLogService))

                .failureHandler(new LoginSuccessFailureHandlers.FailureHandler(loginLogService))

                .defaultSuccessUrl("/dashboard", true)

                .failureUrl("/login?error=true")

                .permitAll()
            )

            .logout(logout -> logout

                .logoutSuccessUrl("/login?logout")

                .permitAll()
            );

        return http.build();
    }
}
