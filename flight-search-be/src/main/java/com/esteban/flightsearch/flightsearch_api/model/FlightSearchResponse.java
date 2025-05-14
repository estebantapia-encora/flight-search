package com.esteban.flightsearch.flightsearch_api.model;

import lombok.Data;

@Data
public class SegmentSummary {
    private String departureTime;   // ISO or formatted
    private String arrivalTime;
    private String carrierCode;
    private String flightNumber;
    // … you can add more later
}

@Data
public class FlightSearchResponse {
    private String id;
    private String departure;
    private String arrival;
    private String airline;
    private String price;

    private String formattedDate;
    private String formattedTimeRange;
    private String formattedDuration;

    private String currency;

    private int numberOfStops;

    private String stops;
}

