package com.crafto.server.Service;

import com.crafto.server.model.SubProduct;
import com.crafto.server.repository.SubProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubProductService {

    private final SubProductRepository subProductRepository;

    public SubProductService(SubProductRepository subProductRepository) {
        this.subProductRepository = subProductRepository;
    }

    // Get subproducts by productId
    public List<SubProduct> getSubProductsByProductId(Long productId) {
        return subProductRepository.findByProductId(productId);
    }
}
