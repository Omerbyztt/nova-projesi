package com.novayazilim.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

/**
 * Çalışanlara atanan görevleri tutan Entity sınıfı.
 */
@Entity
public class Task {

    // Görevin benzersiz kimliği (Primary Key)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Görevin başlığı
    private String title;

    // Görevin detayı/açıklaması
    private String description;

    // Görevin durumu (Örn: Yapılacak, Devam Ediyor, Tamamlandı)
    private String status;

    // Görevin atandığı çalışan (Çoktan Teke ilişki)
    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    private Employee assignedTo;

    // Görevi oluşturan çalışan (Çoktan Teke ilişki)
    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private Employee createdBy;

    // Parametresiz yapıcı metot (JPA için gereklidir)
    public Task() {
    }

    // Getter ve Setter metotları
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Employee getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(Employee assignedTo) {
        this.assignedTo = assignedTo;
    }

    public Employee getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Employee createdBy) {
        this.createdBy = createdBy;
    }
}
