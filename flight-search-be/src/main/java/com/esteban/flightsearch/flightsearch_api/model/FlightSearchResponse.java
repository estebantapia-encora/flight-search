package com.esteban.flightsearch.flightsearch_api.model;

import lombok.Data;

@Data
public class FlightSearchResponse {
    private String departure;
    private String arrival;
    private String airline;
    private String price;
}
