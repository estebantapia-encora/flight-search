package com.esteban.flightsearch.flightsearch_api.service;

import com.esteban.flightsearch.flightsearch_api.config.AmadeusApiConfig;
import com.esteban.flightsearch.flightsearch_api.model.AirlineLookupResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AirlineLookupService {

    private final WebClient webClient;
    private final TokenService tokenService;

    public AirlineLookupService(AmadeusApiConfig config, TokenService tokenService) {
        this.webClient = config.getWebClient();
        this.tokenService = tokenService;
    }

    public String getAirlineName(String code) {
        if (code == null || code.isEmpty()) return code;

        String token = tokenService.getToken();

        try {
            String responseJson = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1/reference-data/airlines")
                            .queryParam("airlineCodes", code)
                            .build())
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            System.out.println("🛰️ Raw response for airline code " + code + ": " + responseJson); // 👈 Add this

            ObjectMapper mapper = new ObjectMapper();
            AirlineLookupResponse response = mapper.readValue(responseJson, AirlineLookupResponse.class);

            if (response.getData() != null && !response.getData().isEmpty()) {
                return response.getData().get(0).getBusinessName();
            } else {
                System.err.println("⚠️ Empty or null 'data' for code: " + code); // 👈 Optional but helpful
            }
        } catch (Exception e) {
            System.err.println("❌ Exception fetching airline name for code " + code + ": " + e.getMessage());
            e.printStackTrace(); // 👈 Include stacktrace to debug further
        }

        return code;
    }

}
