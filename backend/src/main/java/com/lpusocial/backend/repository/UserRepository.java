package com.lpusocial.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lpusocial.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByRegistrationNumber(String registrationNumber);
}