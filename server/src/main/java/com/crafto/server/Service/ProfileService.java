package com.crafto.server.Service;

import com.crafto.server.model.Profile;
import com.crafto.server.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    public Optional<Profile> getProfileByEmail(String email) {
        return profileRepository.findByUid(email);
    }

    public Profile createOrUpdateProfile(Profile profile) {
        Optional<Profile> existing = profileRepository.findByUid(profile.getEmail());
        if (existing.isPresent()) {
            Profile existingProfile = existing.get();
            if (profile.getName() != null) existingProfile.setName(profile.getName());
            if (profile.getDetails() != null) existingProfile.setDetails(profile.getDetails());
            return profileRepository.save(existingProfile);
        } else {
            return profileRepository.save(profile);
        }
    }
}

