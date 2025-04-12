package com.crafto.server.model;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "workshops")
public class Workshop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private String location;
    private String instructor;
    private String duration;

    @ElementCollection
    @CollectionTable(name = "workshop_learning_points", joinColumns = @JoinColumn(name = "workshop_id"))
    @Column(name = "point")
    private List<String> learningPoints;

    private String image;
    private boolean featured;

    @Temporal(TemporalType.DATE)
    private Date date;

    private int seatsAvailable;
    private double costPerSeat;

    public Workshop() {}

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public List<String> getLearningPoints() {
        return learningPoints;
    }

    public void setLearningPoints(List<String> learningPoints) {
        this.learningPoints = learningPoints;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public int getSeatsAvailable() {
        return seatsAvailable;
    }

    public void setSeatsAvailable(int seatsAvailable) {
        this.seatsAvailable = seatsAvailable;
    }

    public double getCostPerSeat() {
        return costPerSeat;
    }

    public void setCostPerSeat(double costPerSeat) {
        this.costPerSeat = costPerSeat;
    }
}
