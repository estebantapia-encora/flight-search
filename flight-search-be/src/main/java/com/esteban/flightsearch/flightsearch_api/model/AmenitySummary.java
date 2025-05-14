package com.esteban.flightsearch.flightsearch_api.model;

import lombok.Data;

@Data
public class AmenitySummary {
    private String description;
    private boolean isChargeable;
    private String amenityType;
}
