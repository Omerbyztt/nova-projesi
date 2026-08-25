package com.novayazilim.dto;

public class CompanyDto {
    private Long id;
    private String name;
    private String logoUrl;

    public CompanyDto() {}

    public CompanyDto(Long id, String name, String logoUrl) {
        this.id = id;
        this.name = name;
        this.logoUrl = logoUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
}
