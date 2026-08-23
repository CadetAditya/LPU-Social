package com.lpusocial.backend.model;

public class UserResponse {

    private Long id;
    private String name;
    private String registrationNumber;
    private String role;

    public UserResponse(Long id, String name, String registrationNumber, String role) {
        this.id = id;
        this.name = name;
        this.registrationNumber = registrationNumber;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public String getRole() {
        return role;
    }
}