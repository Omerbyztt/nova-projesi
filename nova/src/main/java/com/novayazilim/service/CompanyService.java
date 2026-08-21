package com.novayazilim.service;

import com.novayazilim.entity.Company;
import com.novayazilim.repository.CompanyRepository;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public Company save(Company company) {
        return companyRepository.save(company);
    }

    public List<Company> findAll() {
        return companyRepository.findAll();
    }

    public Optional<Company> findById(Long id) {
        return companyRepository.findById(id);
    }

    public Company update(Long id, Company companyDetails) {
        return companyRepository.findById(id)
                .map(existingCompany -> {
                    existingCompany.setName(companyDetails.getName());
                    existingCompany.setTaxNumber(companyDetails.getTaxNumber());
                    existingCompany.setAddress(companyDetails.getAddress());
                    return companyRepository.save(existingCompany);
                })
                .orElseThrow(() -> new RuntimeException("Company not found with id " + id));
    }

    public String uploadLogo(Long id, MultipartFile file) {
        Company company = findById(id).orElseThrow(() -> new RuntimeException("Company not found"));
        
        try {
            String uploadDir = "uploads/logos/";
            Path uploadPath = Paths.get(uploadDir);
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            if (company.getLogoUrl() != null) {
                Path oldFile = Paths.get(uploadDir + company.getLogoUrl());
                Files.deleteIfExists(oldFile);
            }
            
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) originalFilename = "logo.png";
            String fileName = UUID.randomUUID().toString() + "_" + originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");
            
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            company.setLogoUrl(fileName);
            companyRepository.save(company);
            return fileName;
        } catch (Exception e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public void removeLogo(Long id) {
        Company company = findById(id).orElseThrow(() -> new RuntimeException("Company not found"));
        if (company.getLogoUrl() != null) {
            try {
                Path file = Paths.get("uploads/logos/" + company.getLogoUrl());
                Files.deleteIfExists(file);
                
                company.setLogoUrl(null);
                companyRepository.save(company);
            } catch (Exception e) {
                throw new RuntimeException("Failed to delete file", e);
            }
        }
    }

    public void deleteById(Long id) {
        companyRepository.deleteById(id);
    }
}
