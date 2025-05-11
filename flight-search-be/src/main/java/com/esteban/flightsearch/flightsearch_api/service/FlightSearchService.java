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


@Service
public class FlightSearchService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${amadeus.clientId}")
    private String clientId;

    @Value("${amadeus.clientSecret}")
    private String clientSecret;

    public FlightSearchService(AmadeusApiConfig config) {
        this.webClient = config.getWebClient();
    }

    public List<FlightSearchResponse> searchFlights(FlightSearchRequest request) {
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
                            .queryParam("nonStop", request.isNonStop())
                            .queryParam("currencyCode", request.getCurrencyCode())
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

        return extractFlightOffers(responseJson);
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
                    String departureTime = segment.get("departure").get("at").asText();
                    String arrivalTime = segment.get("arrival").get("at").asText();
                    String duration = itinerary.get("duration").asText();
                    int numberOfStops = itinerary.get("segments").size() - 1;

                    LocalDateTime depTime = LocalDateTime.parse(departureTime);
                    LocalDateTime arrTime = LocalDateTime.parse(arrivalTime);
                    String formattedDate = depTime.toLocalDate().toString();
                    String formattedTimeRange = depTime.toLocalTime().format(DateTimeFormatter.ofPattern("h:mm a")) +
                            " - " +
                            arrTime.toLocalTime().format(DateTimeFormatter.ofPattern("h:mm a"));

                    Duration dur = Duration.parse(duration);
                    long hours = dur.toHours();
                    long minutes = dur.minusHours(hours).toMinutes();
                    String formattedDuration = String.format("%d hr %d min", hours, minutes);

                    // Stop locations
                    List<String> stopLocations = new ArrayList<>();
                    if (itinerary.get("segments").size() > 1) {
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
                    flight.setDepartureTime(departureTime);
                    flight.setArrivalTime(arrivalTime);
                    flight.setDuration(duration);
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

}
