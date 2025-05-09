package com.esteban.flightsearch.flightsearch_api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;


@Configuration
public class AmadeusApiConfig {
    @Value("${amadeus.apiUrl}")
    private String apiUrl;

    public WebClient getWebClient() {
        return WebClient.builder()
                .baseUrl(apiUrl)
                .build();
    }

}
