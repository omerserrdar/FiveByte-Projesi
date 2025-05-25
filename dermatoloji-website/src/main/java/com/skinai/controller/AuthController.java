package com.skinai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Şimdilik basit bir doğrulama yapalım
        if ("admin".equals(loginRequest.getUsername()) && "admin123".equals(loginRequest.getPassword())) {
            return ResponseEntity.ok(new LoginResponse("Login successful", "dummy-token"));
        }
        return ResponseEntity.badRequest().body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        // Şimdilik başarılı kayıt dönelim
        return ResponseEntity.ok(new RegisterResponse("Registration successful"));
    }
}

class LoginRequest {
    private String username;
    private String password;

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class LoginResponse {
    private String message;
    private String token;

    public LoginResponse(String message, String token) {
        this.message = message;
        this.token = token;
    }

    // Getters and Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}

class RegisterRequest {
    private String username;
    private String email;
    private String password;

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class RegisterResponse {
    private String message;

    public RegisterResponse(String message) {
        this.message = message;
    }

    // Getters and Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
} 