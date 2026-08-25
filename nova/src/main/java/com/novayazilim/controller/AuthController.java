package com.novayazilim.controller;

import com.novayazilim.dto.AuthRequest;
import com.novayazilim.dto.AuthResponse;
import com.novayazilim.dto.RegisterRequest;
import com.novayazilim.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody AuthRequest request) {
        try {
            return ResponseEntity.ok(authService.authenticate(request));
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("message", "E-posta veya şifre hatalı!"));
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Giriş işlemi sırasında bir hata oluştu: " + e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody com.novayazilim.dto.ChangePasswordRequest request, java.security.Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            authService.changePassword(principal.getName(), request.getNewPassword());
            return ResponseEntity.ok().body(java.util.Map.of("message", "Şifreniz başarıyla güncellendi."));
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Şifre güncellenirken bir hata oluştu: " + e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody com.novayazilim.dto.ForgotPasswordRequest request) {
        try {
            authService.forgotPassword(request.getEmail());
            return ResponseEntity.ok(java.util.Map.of("message", "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."));
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody com.novayazilim.dto.ResetPasswordRequest request) {
        try {
            authService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(java.util.Map.of("message", "Şifreniz başarıyla sıfırlandı."));
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
