package com.crafto.server.repository;

import com.crafto.server.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, String> {
    Address findByUid(String uid);
}
