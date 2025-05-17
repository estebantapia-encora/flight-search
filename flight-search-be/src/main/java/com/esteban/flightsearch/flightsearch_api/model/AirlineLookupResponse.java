package com.esteban.flightsearch.flightsearch_api.model;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class AirlineLookupResponse {
    private Meta meta;
    private List<AirlineData> data;

    @Data
    public static class Meta {
        private int count;
        private Map<String, String> links; // Puedes usar Map si no te interesa modelar "self"
    }

    @Data
    public static class AirlineData {
        private String type; // lo que tú querías incluir
        private String iataCode;
        private String icaoCode;
        private String businessName;
        private String commonName;
    }
}
