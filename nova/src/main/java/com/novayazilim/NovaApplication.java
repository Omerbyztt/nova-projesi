package com.novayazilim;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class NovaApplication {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(NovaApplication.class, args);
        try {
            JdbcTemplate jdbcTemplate = context.getBean(JdbcTemplate.class);
            PasswordEncoder encoder = context.getBean(PasswordEncoder.class);
            String hash = encoder.encode("123456");
            int updated = jdbcTemplate.update("UPDATE employee SET password = ? WHERE email = 'omerbeyazit1907@gmail.com'", hash);
            System.out.println("========== DB FIX APPLIED: Admin password reset to 123456. Rows affected: " + updated + " ==========");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
