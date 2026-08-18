package com.novayazilim.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

/**
 * Şirket içindeki departmanları tutan Entity sınıfı.
 * Örn: Yönetim, Ar-Ge, İK, İdari İşler
 */
@Entity
public class Department {

    // Departmanın benzersiz kimliği (Primary Key)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Departmanın adı
    private String name;

    // Departmanın bağlı olduğu şirket (Çoktan Teke ilişki)
    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    // Parametresiz yapıcı metot (JPA için gereklidir)
    public Department() {
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

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }
}
