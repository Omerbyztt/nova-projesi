package com.novayazilim.repository;

import com.novayazilim.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Company entity'si için veritabanı işlemlerini yürüten Repository arayüzü.
 */
@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
}
