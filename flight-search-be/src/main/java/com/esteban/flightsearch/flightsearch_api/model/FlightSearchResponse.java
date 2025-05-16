package com.esteban.flightsearch.flightsearch_api.model;

import lombok.Data;

import java.util.List;

@Data
public class FlightSearchResponse {
    private String id;
    private String departure;
    private String arrival;
    private String airline;
    private int adults;
    private String price;
    private String totalPrice;
    private String formattedDate;
    private String formattedTimeRange;
    private String formattedDuration;
    private String currency;
    private int numberOfStops;
    private String stops;
    private List<SegmentSummary> segments;
    private List<String> layoverDurations;
}

