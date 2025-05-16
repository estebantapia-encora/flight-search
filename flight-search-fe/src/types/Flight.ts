export type Flight = {
    id: string;
    departure: string;
    arrival: string;
    airline: string;
    price: string;
    adults: number;
    totalPrice: string; 
    formattedDate: string;
    formattedTimeRange: string;
    formattedDuration: string;
    currency: string;
    numberOfStops: number;
    stops: string;
    segments: Segment[];
    layoverDurations: string[];
  };
  
  export type Segment = {
    departureTime: string;
    departureLoc: string;
    arrivalTime: string;
    arrivalLoc: string;
    carrierCode: string;
    flightNumber: string;
    basePrice: string;
    cabin: string;
    includedCheckedBagsQuantity: string;
    amenities: Amenity[];
  };
  
  export type Amenity = {
    description: string;
    amenityType: string;
    chargeable: boolean;
  };

  