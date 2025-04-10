package com.crafto.server.Controllers;

import com.crafto.server.model.Profile;
import com.crafto.server.Service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.crafto.server.repository.ProfileRepository;

import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend calls
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private ProfileRepository profileRepository;

    @GetMapping("/get")
    public ResponseEntity<Profile> getProfile(@RequestParam String uid) {
        Optional<Profile> profile = profileRepository.findByUid(uid);
        if (profile.isPresent()) {
            return ResponseEntity.ok(profile.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdateProfile(@RequestBody Profile profile) {
        if (profile.getEmail() == null || profile.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        return ResponseEntity.ok(profileService.createOrUpdateProfile(profile));
    }
}
