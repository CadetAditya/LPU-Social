package com.lpusocial.backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lpusocial.backend.model.User;
import com.lpusocial.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserByRegistrationNumber(String registrationNumber) {
        return userRepository.findByRegistrationNumber(registrationNumber);
    }

    public Optional<User> login(String registrationNumber, String password) {

        Optional<User> user =
                userRepository.findByRegistrationNumber(registrationNumber);

        if (user.isPresent() &&
            user.get().getPassword().equals(password)) {

            return user;
        }

        return Optional.empty();
    }
}