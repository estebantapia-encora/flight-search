package com.esteban.flightsearch.flightsearch_api.service;

import com.esteban.flightsearch.flightsearch_api.config.AmadeusApiConfig;
import com.esteban.flightsearch.flightsearch_api.model.FlightSearchRequest;
import com.esteban.flightsearch.flightsearch_api.model.FlightSearchResponse;
import com.esteban.flightsearch.flightsearch_api.model.SegmentSummary;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.UUID;
import com.esteban.flightsearch.flightsearch_api.model.AmenitySummary;


@Service
public class FlightSearchService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ConcurrentHashMap<String, CachedResult> cache = new ConcurrentHashMap<>();
    private final long cacheTTL = 30 * 60 * 1000; // 30 minutes in milliseconds
    private final AirlineLookupService airlineLookupService;

    private final TokenService tokenService;

    public FlightSearchService(AmadeusApiConfig config, TokenService tokenService, AirlineLookupService airlineLookupService) {
        this.webClient = config.getWebClient();
        this.tokenService = tokenService;
        this.airlineLookupService = airlineLookupService;
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
        String accessToken = tokenService.getToken();


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


        List<FlightSearchResponse> result = extractFlightOffers(responseJson, request.getAdults());

        // ✅ Cache the result
        cache.put(cacheKey, new CachedResult(result, System.currentTimeMillis()));
        return result;
    }

    private List<FlightSearchResponse> extractFlightOffers(String json, int adults) {
        List<FlightSearchResponse> results = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode data = root.get("data");
            if (data != null && data.isArray()) {
                for (JsonNode offer : data) {
                    FlightSearchResponse flight = new FlightSearchResponse();
                    // if Amadeus returns its own "id" field:
                    if (offer.has("id")) {
                        flight.setId(offer.get("id").asText());
                    } else {
                        // fallback to a generated UUID
                        flight.setId(UUID.randomUUID().toString());
                    }

                    JsonNode itinerary = offer.get("itineraries").get(0);
                    JsonNode segment = itinerary.get("segments").get(0);
                    List<SegmentSummary> segmentSummaries = new ArrayList<>();
                    JsonNode segments = itinerary.get("segments");

                    for (JsonNode seg : segments) {
                        SegmentSummary summary = new SegmentSummary();
                        summary.setDepartureTime(seg.get("departure").get("at").asText());
                        summary.setDepartureLoc(seg.get("departure").get("iataCode").asText());
                        summary.setArrivalTime(seg.get("arrival").get("at").asText());
                        summary.setArrivalLoc(seg.get("arrival").get("iataCode").asText());
                        summary.setCarrierCode(seg.get("carrierCode").asText());
                        summary.setFlightNumber(seg.get("number").asText());

                        // Optional enrichments from travelerPricings
                        JsonNode travelerPricings = offer.get("travelerPricings");
                        if (travelerPricings != null && travelerPricings.isArray() && travelerPricings.size() > 0) {
                            JsonNode firstTraveler = travelerPricings.get(0);
                            JsonNode priceNode = firstTraveler.get("price");
                            if (priceNode != null && priceNode.has("base")) {
                                summary.setBasePrice(priceNode.get("base").asText());
                            }

                            JsonNode fareDetails = firstTraveler.get("fareDetailsBySegment");
                            if (fareDetails != null && fareDetails.isArray()) {
                                // Try to find matching segmentId
                                String segId = seg.get("id").asText();
                                for (JsonNode detail : fareDetails) {
                                    if (detail.has("segmentId") && detail.get("segmentId").asText().equals(segId)) {
                                        if (detail.has("cabin")) {
                                            summary.setCabin(detail.get("cabin").asText());
                                        }

                                        // ✅ Included Checked Bags
                                        JsonNode checkedBags = detail.get("includedCheckedBags");
                                        if (checkedBags != null && checkedBags.has("quantity")) {
                                            summary.setIncludedCheckedBagsQuantity(checkedBags.get("quantity").asText());
                                        } else {
                                            summary.setIncludedCheckedBagsQuantity("N/A");
                                        }

                                        // ✅ Included Cabin Bags
                                        JsonNode cabinBags = detail.get("includedCabinBags");
                                        if (cabinBags != null && cabinBags.has("quantity")) {
                                            summary.setIncludedCabinBagsQuantity(cabinBags.get("quantity").asText());
                                        } else {
                                            summary.setIncludedCabinBagsQuantity("N/A");
                                        }

                                        // ✅ Baggage Amenity Description
                                        List<AmenitySummary> amenitySummaries = new ArrayList<>();
                                        JsonNode amenities = detail.get("amenities");

                                        if (amenities != null && amenities.isArray()) {
                                            for (JsonNode amenity : amenities) {
                                                if (amenity.has("description") && amenity.has("isChargeable") && amenity.has("amenityType")) {
                                                    AmenitySummary a = new AmenitySummary();
                                                    a.setDescription(amenity.get("description").asText());
                                                    a.setChargeable(amenity.get("isChargeable").asBoolean());
                                                    a.setAmenityType(amenity.get("amenityType").asText());
                                                    amenitySummaries.add(a);
                                                }
                                            }
                                        }

                                        summary.setAmenities(amenitySummaries);

                                        break;
                                    }
                                }
                            }
                        }

                        segmentSummaries.add(summary);
                    }
                    List<String> layoverDurations = new ArrayList<>();
                    for (int j = 0; j < segments.size() - 1; j++) {
                        JsonNode currentArrival = segments.get(j).get("arrival");
                        JsonNode nextDeparture = segments.get(j + 1).get("departure");

                        LocalDateTime arrivalTime = LocalDateTime.parse(currentArrival.get("at").asText());
                        LocalDateTime departureTime = LocalDateTime.parse(nextDeparture.get("at").asText());

                        Duration layover = Duration.between(arrivalTime, departureTime);
                        long hours = layover.toHours();
                        long minutes = layover.minusHours(hours).toMinutes();

                        layoverDurations.add(String.format("%d hr %d min", hours, minutes));
                    }

                    flight.setSegments(segmentSummaries);
                    String departure = segment.get("departure").get("iataCode").asText();
                    String arrival = segment.get("arrival").get("iataCode").asText();
                    String carrier = segment.get("carrierCode").asText();

                    JsonNode priceNode = offer.get("price");
                    String price = priceNode.get("total").asText();
                    double priceValue = Double.parseDouble(price);
                    String totalPrice = String.format("%.2f", priceValue * adults);

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
                    flight.setAirline(airlineLookupService.getAirlineName(carrier));  // ✅ This sets the full name (e.g., "United Airlines")
                    flight.setPrice(price);
                    flight.setTotalPrice(totalPrice);
                    flight.setAdults(adults);
                    flight.setCurrency(currency);
                    flight.setNumberOfStops(numberOfStops);
                    flight.setFormattedDate(formattedDate);
                    flight.setFormattedTimeRange(formattedTimeRange);
                    flight.setFormattedDuration(formattedDuration);
                    flight.setStops(stopsCombined);
                    flight.setLayoverDurations(layoverDurations);
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
