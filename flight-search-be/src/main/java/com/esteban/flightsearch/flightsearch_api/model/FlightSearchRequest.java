package com.esteban.flightsearch.flightsearch_api.model;

import lombok.Data;

@Data
public class FlightSearchRequest {
    private String originLocationCode;
    private String destinationLocationCode;
    private String departureDate;
    private String returnDate;
    private int adults;
    private String currencyCode;
    private boolean nonStop;
}

