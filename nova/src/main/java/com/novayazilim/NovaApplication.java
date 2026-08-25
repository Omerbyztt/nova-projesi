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
            
            // Seed Company Logo
            int logoUpdated = jdbcTemplate.update("UPDATE company SET logo_url = 'a2e5fbcc-08f9-4bab-9187-6eabe864c459_Gemini_Generated_Image_ivkmomivkmomivkm.jpg'");
            System.out.println("========== DB FIX APPLIED: Company logo seeded. Rows affected: " + logoUpdated + " ==========");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
