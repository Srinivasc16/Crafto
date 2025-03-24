package com.crafto.server.Controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getUser(HttpSession session) {
        Object user = session.getAttribute("user");

        if (user != null) {
            return ResponseEntity.ok(Map.of("user", user));
        }
        return ResponseEntity.status(401).body(Map.of("error", "No user authenticated"));
    }

    @GetMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        new SecurityContextLogoutHandler().logout(request, response, null);

        // ✅ Return JSON response instead of a redirect
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }
}
