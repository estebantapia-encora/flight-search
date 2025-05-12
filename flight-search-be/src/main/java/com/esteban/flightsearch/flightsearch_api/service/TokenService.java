package com.esteban.flightsearch.flightsearch_api.service;

import com.esteban.flightsearch.flightsearch_api.config.AmadeusApiConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class TokenService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private String token;
    private long expirationTime;

    @Value("${amadeus.clientId}")
    private String clientId;

    @Value("${amadeus.clientSecret}")
    private String clientSecret;

    public TokenService(AmadeusApiConfig config) {
        this.webClient = config.getWebClient();
    }

    public synchronized String getToken() {
        long now = System.currentTimeMillis();
        if (token == null || now >= expirationTime) {
            System.out.println("🔒 Fetching new token from Amadeus...");

            String json = webClient.post()
                    .uri("/v1/security/oauth2/token")
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .body(BodyInserters
                            .fromFormData("grant_type", "client_credentials")
                            .with("client_id", clientId)
                            .with("client_secret", clientSecret))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            try {
                JsonNode node = objectMapper.readTree(json);
                token = node.get("access_token").asText();
                int expiresIn = node.get("expires_in").asInt(); // e.g. 1799 seconds
                expirationTime = now + (expiresIn - 30) * 1000L; // buffer of 30 seconds
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse access token", e);
            }
        } else {
            System.out.println("🔁 Reusing cached token");
        }

        return token;
    }
}
