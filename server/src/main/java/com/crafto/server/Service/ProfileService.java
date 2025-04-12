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

    public Optional<Profile> getProfileByUid(String uid) {
        return profileRepository.findByUid(uid);
    }

    public Profile createOrUpdateProfile(Profile profile) {
        Optional<Profile> existing = profileRepository.findByUid(profile.getUid());
        if (existing.isPresent()) {
            Profile existingProfile = existing.get();
            if (profile.getName() != null) existingProfile.setName(profile.getName());
            if (profile.getEmail() != null) existingProfile.setEmail(profile.getEmail());
            if (profile.getDetails() != null) existingProfile.setDetails(profile.getDetails());
            return profileRepository.save(existingProfile);
        } else {
            return profileRepository.save(profile);
        }
    }
}
