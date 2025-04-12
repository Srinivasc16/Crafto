package com.crafto.server.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "profilex")
public class Profile {

    @Id
    private String uid;

    private String name;
    private String email;
    private String details;

    public Profile() {}

    public Profile(String uid, String name, String email, String details) {
        this.uid = uid;
        this.name = name;
        this.email = email;
        this.details = details;
    }

    // Getters and Setters

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}
