package com.esteban.flightsearch.flightsearch_api.model;

import lombok.Data;

@Data
public class FlightSearchResponse {
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
