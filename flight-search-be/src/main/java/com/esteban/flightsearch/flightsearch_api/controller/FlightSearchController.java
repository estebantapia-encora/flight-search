package com.esteban.flightsearch.flightsearch_api.controller;

import com.esteban.flightsearch.flightsearch_api.model.FlightSearchRequest;
import com.esteban.flightsearch.flightsearch_api.model.FlightSearchResponse;
import com.esteban.flightsearch.flightsearch_api.service.FlightSearchService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightSearchController {

    private final FlightSearchService flightSearchService;

    public FlightSearchController(FlightSearchService service) {
        this.flightSearchService = service;
    }

    @PostMapping("/search")
    public List<FlightSearchResponse> searchFlights(@RequestBody FlightSearchRequest request) {
        return flightSearchService.searchFlights(request);
    }
}