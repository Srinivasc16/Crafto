package com.crafto.server.model;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class Orders {

    @Id
    private String uid; // Primary Key (same as Profile UID)

    private String item;
    private int quantity;
    private double price;

    public Orders() {}

    public Orders(String uid, String item, int quantity, double price) {
        this.uid = uid;
        this.item = item;
        this.quantity = quantity;
        this.price = price;
    }

    // Getters and Setters

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getItem() {
        return item;
    }

    public void setItem(String item) {
        this.item = item;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
