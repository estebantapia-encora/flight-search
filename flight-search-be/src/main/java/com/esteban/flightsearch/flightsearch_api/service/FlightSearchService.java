package com.esteban.flightsearch.flightsearch_api.service;

import com.esteban.flightsearch.flightsearch_api.config.AmadeusApiConfig;
import com.esteban.flightsearch.flightsearch_api.model.FlightSearchRequest;
import com.esteban.flightsearch.flightsearch_api.model.FlightSearchResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;


@Service
public class FlightSearchService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ConcurrentHashMap<String, CachedResult> cache = new ConcurrentHashMap<>();
    private final long cacheTTL = 30 * 60 * 1000; // 30 minutes in milliseconds

    @Value("${amadeus.clientId}")
    private String clientId;

    @Value("${amadeus.clientSecret}")
    private String clientSecret;

    public FlightSearchService(AmadeusApiConfig config) {
        this.webClient = config.getWebClient();
    }

    public List<FlightSearchResponse> searchFlights(FlightSearchRequest request) {


        String cacheKey = buildCacheKey(request);

        CachedResult cached = cache.get(cacheKey);
        if (cached != null && !cached.isExpired()) {
            System.out.println("✅ Using cached result for: " + cacheKey);
            return cached.data;
        }

        System.out.println("🚀 Calling Amadeus API for: " + cacheKey);
        // 1. Get access token
        String tokenJson = webClient.post()
                .uri("/v1/security/oauth2/token")
                .header("Content-Type", "application/x-www-form-urlencoded")
                .body(org.springframework.web.reactive.function.BodyInserters.fromFormData("grant_type", "client_credentials")
                        .with("client_id", clientId)
                        .with("client_secret", clientSecret))

                .retrieve()
                .bodyToMono(String.class)
                .block();

        String accessToken = extractAccessToken(tokenJson);

        // 2. Search for flights
        String responseJson = webClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder
                            .path("/v2/shopping/flight-offers")
                            .queryParam("originLocationCode", request.getOriginLocationCode())
                            .queryParam("destinationLocationCode", request.getDestinationLocationCode())
                            .queryParam("departureDate", request.getDepartureDate())
                            .queryParam("adults", request.getAdults())
                            .queryParam("currencyCode", request.getCurrencyCode())
                            .queryParam("nonStop", request.isNonStop())
                            .queryParam("max", 10);

                    if (request.getReturnDate() != null && !request.getReturnDate().isBlank()) {
                        builder.queryParam("returnDate", request.getReturnDate());
                    }

                    return builder.build();
                })
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(String.class)
                .block();


        List<FlightSearchResponse> result = extractFlightOffers(responseJson);

        // ✅ Cache the result
        cache.put(cacheKey, new CachedResult(result, System.currentTimeMillis()));
        return result;
    }

    private String extractAccessToken(String json) {
        try {
            JsonNode node = objectMapper.readTree(json);
            return node.get("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract access token", e);
        }
    }

    private List<FlightSearchResponse> extractFlightOffers(String json) {
        List<FlightSearchResponse> results = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode data = root.get("data");
            if (data != null && data.isArray()) {
                for (JsonNode offer : data) {
                    FlightSearchResponse flight = new FlightSearchResponse();

                    JsonNode itinerary = offer.get("itineraries").get(0); // outbound only
                    JsonNode segment = itinerary.get("segments").get(0);  // first leg

                    String departure = segment.get("departure").get("iataCode").asText();
                    String arrival = segment.get("arrival").get("iataCode").asText();
                    String carrier = segment.get("carrierCode").asText();

                    JsonNode priceNode = offer.get("price");
                    String price = priceNode.get("total").asText();
                    String currency = priceNode.has("currency") ? priceNode.get("currency").asText() : null;

                    // ✅ new fields
                    LocalDateTime depTime = LocalDateTime.parse(segment.get("departure").get("at").asText());
                    LocalDateTime arrTime = LocalDateTime.parse(segment.get("arrival").get("at").asText());
                    String formattedDate = depTime.toLocalDate().toString();
                    String formattedTimeRange = depTime.toLocalTime().format(DateTimeFormatter.ofPattern("h:mm a")) +
                            " - " +
                            arrTime.toLocalTime().format(DateTimeFormatter.ofPattern("h:mm a"));

                    Duration dur = Duration.parse(itinerary.get("duration").asText());
                    long hours = dur.toHours();
                    long minutes = dur.minusHours(hours).toMinutes();
                    String formattedDuration = String.format("%d hr %d min", hours, minutes);

                    int numberOfStops = itinerary.get("segments").size() - 1;

                    List<String> stopLocations = new ArrayList<>();
                    if (numberOfStops > 0) {
                        for (int i = 0; i < itinerary.get("segments").size() - 1; i++) {
                            JsonNode stopSegment = itinerary.get("segments").get(i);
                            String stopIata = stopSegment.get("arrival").get("iataCode").asText();
                            stopLocations.add(stopIata);
                        }
                    }
                    String stopsCombined = stopLocations.isEmpty() ? "None" : String.join(", ", stopLocations);

                    // ✅ set all fields
                    flight.setDeparture(departure);
                    flight.setArrival(arrival);
                    flight.setAirline(carrier);
                    flight.setPrice(price);
                    flight.setCurrency(currency);
                    flight.setNumberOfStops(numberOfStops);
                    flight.setFormattedDate(formattedDate);
                    flight.setFormattedTimeRange(formattedTimeRange);
                    flight.setFormattedDuration(formattedDuration);
                    flight.setStops(stopsCombined);
                    results.add(flight);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse flight offers", e);
        }

        return results;
    }
    private String buildCacheKey(FlightSearchRequest req) {
        return String.join("|",
                req.getOriginLocationCode(),
                req.getDestinationLocationCode(),
                req.getDepartureDate(),
                req.getReturnDate() != null ? req.getReturnDate() : "",
                String.valueOf(req.getAdults()),
                req.getCurrencyCode(),
                String.valueOf(req.isNonStop())
        );
    }
    private static class CachedResult {
        List<FlightSearchResponse> data;
        long timestamp;

        CachedResult(List<FlightSearchResponse> data, long timestamp) {
            this.data = data;
            this.timestamp = timestamp;
        }

        boolean isExpired() {
            return System.currentTimeMillis() - timestamp > 10 * 60 * 1000;
        }
    }

}
