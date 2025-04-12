package com.crafto.server.repository;

import com.crafto.server.model.Workshop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WorkshopRepository extends JpaRepository<Workshop, Long> {
}
