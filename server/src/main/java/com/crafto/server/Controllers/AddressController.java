package com.crafto.server.Controllers;

import com.crafto.server.model.Address;
import com.crafto.server.Service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/address")
@CrossOrigin(origins = "http://localhost:5173") // allow frontend to access
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping("/save")
    public ResponseEntity<List<Address>> saveAddresses(@RequestBody List<Address> addresses) {
        List<Address> saved = addresses.stream()
                .map(addressService::saveOrUpdateAddress)
                .toList();
        return ResponseEntity.ok(saved);
    }
    // Get Address by UID
    @GetMapping("/{uid}")
    public ResponseEntity<?> getAddress(@PathVariable String uid) {
        Optional<Address> address = addressService.getAddressByUid(uid);
        return address.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

