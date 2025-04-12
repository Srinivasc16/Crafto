package com.crafto.server.Service;

import com.crafto.server.model.Address;
import com.crafto.server.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    public Address saveOrUpdateAddress(Address address) {
        return addressRepository.save(address); // saves or updates based on uid
    }

    public Optional<Address> getAddressByUid(String uid) {
        return addressRepository.findById(uid);
    }
}
