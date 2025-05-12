package com.esteban.flightsearch.flightsearch_api.controller;

import com.esteban.flightsearch.flightsearch_api.service.AirportSearchService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
public class AirportSearchController {

    private final AirportSearchService service;

    @Value("${amadeus.clientId}")
    private String clientId;

    @Value("${amadeus.clientSecret}")
    private String clientSecret;

    public AirportSearchController(AirportSearchService service) {
        this.service = service;
    }

    @GetMapping("/search")
    public List<String> searchAirports(@RequestParam String keyword) {
        return service.searchAirports(keyword);
    }

}
