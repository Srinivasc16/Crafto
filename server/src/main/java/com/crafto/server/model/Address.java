package com.crafto.server.model;

import jakarta.persistence.*;

@Entity
@Table(name = "address")
public class Address {

    @Id
    private String uid; // Primary Key (same as Profile UID)

    private String street;
    private String city;
    private String state;
    private String zip;

    public Address() {}

    public Address(String uid, String street, String city, String state, String zip) {
        this.uid = uid;
        this.street = street;
        this.city = city;
        this.state = state;
        this.zip = zip;
    }

    // Getters and Setters

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }
}
