package com.lpusocial.backend.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lpusocial.backend.model.LoginRequest;
import com.lpusocial.backend.model.User;
import com.lpusocial.backend.model.UserResponse;
import com.lpusocial.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public UserResponse createUser(@RequestBody User user) {

        User savedUser = userService.saveUser(user);

        return new UserResponse(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getRegistrationNumber(),
            savedUser.getRole()
        );
    }

    @GetMapping("/{registrationNumber}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable String registrationNumber) {

        Optional<User> user =
                userService.getUserByRegistrationNumber(registrationNumber);

        return user
                .map(u -> new UserResponse(
                        u.getId(),
                        u.getName(),
                        u.getRegistrationNumber(),
                        u.getRole()
                ))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(
            @RequestBody LoginRequest loginRequest) {

        Optional<User> user = userService.login(
                loginRequest.getRegistrationNumber(),
                loginRequest.getPassword()
        );

        return user
                .map(u -> new UserResponse(
                        u.getId(),
                        u.getName(),
                        u.getRegistrationNumber(),
                        u.getRole()
                ))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(401).build());
    }
}