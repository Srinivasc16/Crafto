package com.crafto.server.repository;

import com.crafto.server.model.SubProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubProductRepository extends JpaRepository<SubProduct, Long> {
    @Query(value = "SELECT * FROM subproducts WHERE product_id = :productId", nativeQuery = true)
    List<SubProduct> findByProductId(Long productId);
}
