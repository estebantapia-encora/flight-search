import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { Flight, Segment } from "../types/Flight";
import { Box, Typography } from "@mui/material";

function formatTime(time: string) {
  return new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function DetailsPage() {
  const { id } = useParams();
  const flights = useSelector(
    (state: RootState) => state.searchResults.results
  );
  const flight = flights.find((f) => f.id === id) as Flight | undefined;

  if (!flight) return <div>Flight not found.</div>;

  const totalPrice = parseFloat(flight.price);
  const totalBase = parseFloat(flight.segments[0].basePrice); // ✅ Use only one segment
  const totalFees = totalPrice - totalBase;
  
  

  return (
    <Box sx={{ padding: "40px" }}>
    <Typography variant="h6" sx={{ mt: 2 }}>
  Total Price: {flight.currency} ${totalPrice.toFixed(2)}
</Typography>
<Typography variant="h6">
  Base Fare Total: {flight.currency} ${totalBase.toFixed(2)}
</Typography>
<Typography variant="h6">
  Estimated Fees: {flight.currency} ${totalFees.toFixed(2)}
</Typography>


      {flight.segments.map((segment: Segment, index: number) => (
        <Box
          key={index}
          sx={{ mb: 4, p: 2, border: "1px solid #ccc", borderRadius: "10px" }}
        >
          <Typography variant="h6">Segment {index + 1}</Typography>
          <Typography>Date: {formatDate(segment.departureTime)}</Typography>
          <Typography>
            Time: {formatTime(segment.departureTime)} -{" "}
            {formatTime(segment.arrivalTime)}
          </Typography>
          <Typography>
            Route: {segment.departureLoc} → {segment.arrivalLoc}
          </Typography>
          <Typography>Airline Code: {segment.carrierCode}</Typography>
          <Typography>Flight Number: {segment.flightNumber}</Typography>
          <Typography>Cabin Class: {segment.cabin}</Typography>
          <Typography>
            Base Price: {flight.currency} ${segment.basePrice}
          </Typography>
          <Typography>
            Baggage: {segment.includedCabinBagsQuantity} Cabin,{" "}
            {segment.includedCheckedBagsQuantity} Checked
          </Typography>

          <Typography sx={{ mt: 1, fontWeight: "600" }}>Amenities:</Typography>
          {segment.amenities.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "1.5em" }}>
              {segment.amenities.map((a, i) => (
                <li key={i}>
                  {a.description} {a.chargeable ? "(Chargeable)" : "(Free)"}
                </li>
              ))}
            </ul>
          ) : (
            <Typography>No amenities listed.</Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}

export default DetailsPage;
