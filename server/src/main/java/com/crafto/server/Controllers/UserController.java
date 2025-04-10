package com.crafto.server.Controllers;

import com.crafto.server.model.User;
import com.crafto.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173") // Adjust for your frontend URL
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/google-auth")
    public ResponseEntity<?> handleGoogleAuth(@RequestBody User userPayload) {
        Optional<User> existingUser = userRepository.findById(userPayload.getUid());

        if (existingUser.isPresent()) {
            // User already exists, return UID
            return ResponseEntity.ok(existingUser.get().getUid());
        } else {
            // Save new user
            User savedUser = userRepository.save(userPayload);
            return ResponseEntity.ok(savedUser.getUid());
        }
    }
    @GetMapping("/{uid}")
    public ResponseEntity<User> getUserByUid(@PathVariable String uid) {
        Optional<User> user = userRepository.findById(uid);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}

