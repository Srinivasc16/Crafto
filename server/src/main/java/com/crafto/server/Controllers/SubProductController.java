package com.crafto.server.Controllers;

import com.crafto.server.model.SubProduct;
import com.crafto.server.Service.SubProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")  // Allow React frontend access
public class SubProductController {

    private final SubProductService subProductService;

    public SubProductController(SubProductService subProductService) {
        this.subProductService = subProductService;
    }

    // GET subproducts by product ID
    @GetMapping("/{productId}/subproducts")
    public ResponseEntity<List<SubProduct>> getSubProductsByProductId(@PathVariable Long productId) {
        List<SubProduct> subProducts = subProductService.getSubProductsByProductId(productId);

        if (subProducts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(subProducts);
    }
}
