package com.crafto.server.Controllers;

import com.crafto.server.model.Profile;
import com.crafto.server.Service.ProfileService;
import com.crafto.server.repository.ProfileRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private ProfileRepository profileRepository;

    // GET by UID
    @GetMapping("/{uid}")
    public ResponseEntity<Profile> getProfileByUid(@PathVariable String uid) {
        Optional<Profile> profile = profileRepository.findByUid(uid);
        return profile.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST: Create or update profile
    @PostMapping
    public ResponseEntity<?> createOrUpdateProfile(@RequestBody Profile profile) {
        if (profile.getEmail() == null || profile.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        return ResponseEntity.ok(profileService.createOrUpdateProfile(profile));
    }
}
