package com.esteban.flightsearch.flightsearch_api.model;
import lombok.Data;
import java.util.List;

@Data
public class SegmentSummary {
    private String departureTime;
    private String departureLoc;
    private String arrivalTime;
    private String arrivalLoc;
    private String carrierCode;
    private String flightNumber;
    private String basePrice;
    private String cabin;
    private String includedCheckedBagsQuantity;
    private String includedCabinBagsQuantity;
    private List<AmenitySummary> amenities;

}
