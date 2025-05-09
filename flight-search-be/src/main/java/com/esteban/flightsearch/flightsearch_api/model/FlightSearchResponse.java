package com.esteban.flightsearch.flightsearch_api.model;

import lombok.Data;

@Data
public class FlightSearchResponse {
    private String departure;
    private String arrival;
    private String airline;
    private String price;
    private String departureTime;
    private String arrivalTime;
    private String duration;
    private int numberOfStops;
}
