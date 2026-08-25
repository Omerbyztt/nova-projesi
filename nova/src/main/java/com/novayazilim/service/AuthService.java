package com.novayazilim.service;

import com.novayazilim.dto.AuthRequest;
import com.novayazilim.dto.AuthResponse;
import com.novayazilim.dto.RegisterRequest;
import com.novayazilim.entity.Department;
import com.novayazilim.entity.Employee;
import com.novayazilim.entity.Company;
import com.novayazilim.entity.Role;
import com.novayazilim.repository.DepartmentRepository;
import com.novayazilim.repository.EmployeeRepository;
import com.novayazilim.repository.CompanyRepository;
import com.novayazilim.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final com.novayazilim.repository.PasswordResetTokenRepository passwordResetTokenRepository;

    public AuthService(EmployeeRepository employeeRepository, 
                       DepartmentRepository departmentRepository,
                       CompanyRepository companyRepository,
                       PasswordEncoder passwordEncoder, 
                       JwtService jwtService, 
                       AuthenticationManager authenticationManager,
                       com.novayazilim.repository.PasswordResetTokenRepository passwordResetTokenRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    public AuthResponse register(RegisterRequest request) {
        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        }

        if (department == null) {
            if (request.getRole() == Role.COMPANY_ADMIN) {
                Company company = new Company();
                company.setName("Kurucu Şirket");
                companyRepository.save(company);

                Department newDept = new Department();
                newDept.setName("Yönetim");
                newDept.setCompany(company);
                department = departmentRepository.save(newDept);
            } else {
                throw new RuntimeException("Departman bulunamadı");
            }
        }

        Employee employee = new Employee();
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        employee.setTitle(request.getTitle());
        employee.setRole(request.getRole());
        employee.setDepartment(department);

        employeeRepository.save(employee);
        
        String jwtToken = jwtService.generateToken(employee);
        return new AuthResponse(jwtToken);
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        Employee employee = employeeRepository.findFirstByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
                
        String jwtToken = jwtService.generateToken(employee, request.isRememberMe());
        return new AuthResponse(jwtToken);
    }

    public void changePassword(String email, String newPassword) {
        Employee employee = employeeRepository.findFirstByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        employee.setPassword(passwordEncoder.encode(newPassword));
        employee.setFirstLogin(false);
        
        employeeRepository.save(employee);
    }

    public void forgotPassword(String email) {
        Employee employee = employeeRepository.findFirstByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        String token = java.util.UUID.randomUUID().toString();
        
        com.novayazilim.entity.PasswordResetToken resetToken = new com.novayazilim.entity.PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setEmployee(employee);
        resetToken.setExpiryDate(java.time.LocalDateTime.now().plusMinutes(15));
        resetToken.setUsed(false);
        
        passwordResetTokenRepository.save(resetToken);

        System.out.println("[MOCK EMAIL] Şifre sıfırlama linki: http://localhost:5173/reset-password?token=" + token);
    }

    public void resetPassword(String token, String newPassword) {
        com.novayazilim.entity.PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Geçersiz veya süresi dolmuş token"));

        if (resetToken.isUsed()) {
            throw new RuntimeException("Bu şifre sıfırlama bağlantısı zaten kullanılmış.");
        }

        if (resetToken.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Bu şifre sıfırlama bağlantısının süresi dolmuş.");
        }

        Employee employee = resetToken.getEmployee();
        employee.setPassword(passwordEncoder.encode(newPassword));
        employeeRepository.save(employee);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }
}
