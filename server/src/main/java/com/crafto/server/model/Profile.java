package com.crafto.server.model;


import jakarta.persistence.*;

@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String uid;

    private String name;
    private String email;
    private String details;

    public Profile() {}

    public Profile(String name, String email, String details) {
        this.name = name;
        this.email = email;
        this.details = details;
    }

    // Getters and Setters

    public String getId() {
        return uid;
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

