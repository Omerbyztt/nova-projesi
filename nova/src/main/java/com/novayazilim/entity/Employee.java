package com.novayazilim.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

/**
 * Şirket çalışanlarını tutan Entity sınıfı.
 */
@Entity
public class Employee {

    // Çalışanın benzersiz kimliği (Primary Key)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Çalışanın adı ve soyadı
    private String name;

    // Çalışanın rolü (Örn: Müdür, Geliştirici, Asistan, Destek)
    private String role;

    // Çalışanın bağlı olduğu departman (Çoktan Teke ilişki)
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    // Parametresiz yapıcı metot (JPA için gereklidir)
    public Employee() {
    }

    // Getter ve Setter metotları
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }
}
