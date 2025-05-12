package com.esteban.flightsearch.flightsearch_api.service;

import com.esteban.flightsearch.flightsearch_api.config.AmadeusApiConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class AirportSearchService {

    private final WebClient webClient;
    private final TokenService tokenService;

    public AirportSearchService(AmadeusApiConfig config, TokenService tokenService) {
        this.webClient = config.getWebClient();
        this.tokenService = tokenService;
    }

    public List<String> searchAirports(String keyword) {
        String token = tokenService.getToken();

        String json = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1/reference-data/locations")
                        .queryParam("subType", "AIRPORT")
                        .queryParam("keyword", keyword)
                        .queryParam("max", 5)
                        .build())
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        List<String> results = new ArrayList<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode data = mapper.readTree(json).get("data");
            for (JsonNode airport : data) {
                String name = airport.get("name").asText();
                String code = airport.get("iataCode").asText();
                results.add(name + " (" + code + ")");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse airport results", e);
        }

        return results;
    }
}
