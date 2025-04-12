package com.crafto.server.Controllers;

import com.crafto.server.exceptions.ResourceNotFoundException;
import com.crafto.server.model.Workshop;
import com.crafto.server.repository.WorkshopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/workshops")
@CrossOrigin(origins = "http://localhost:5173") // or "*" for testing
public class WorkshopController {

    @Autowired
    private WorkshopRepository workshopRepository;

    @GetMapping
    public List<Workshop> getAllWorkshops() {
        return workshopRepository.findAll();
    }
}
