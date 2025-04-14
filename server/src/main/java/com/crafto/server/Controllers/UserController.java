package com.crafto.server.Controllers;

import com.crafto.server.model.User;
import com.crafto.server.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173") // Adjust for your frontend URL
public class UserController {

    @Autowired
    private UserRepository userRepository;
    private final List<User> temporaryUsers = new CopyOnWriteArrayList<>();
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
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully.");
    }

    @PostMapping
    public ResponseEntity<String> storeUserInSession(@RequestBody User user, HttpSession session) {
        session.setAttribute("currentUser", user);
        return ResponseEntity.ok("User stored in session");
    }
    @GetMapping
    public ResponseEntity<User> getUserFromSession(HttpSession session) {
        User user = (User) session.getAttribute("currentUser");
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(404).body(null);
        }
    }

    @GetMapping("/{uid}")
    public ResponseEntity<User> getUserByUid(@PathVariable String uid) {
        Optional<User> user = userRepository.findById(uid);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}

