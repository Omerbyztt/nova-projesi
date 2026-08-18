package com.novayazilim.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * Şirket bilgilerini tutan Entity sınıfı.
 */
@Entity
public class Company {

    // Şirketin benzersiz kimliği (Primary Key)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Şirketin adı
    private String name;

    // Parametresiz yapıcı metot (JPA için gereklidir)
    public Company() {
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
}
