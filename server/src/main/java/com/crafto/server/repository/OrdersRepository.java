package com.crafto.server.repository;

import com.crafto.server.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdersRepository extends JpaRepository<Orders, String> {
    Orders findByUid(String uid);
}
