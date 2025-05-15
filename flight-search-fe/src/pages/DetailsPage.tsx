import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { Flight, Segment } from "../types/Flight";
import Airplane from "../assets/AirplaneBackground.jpg";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { Box, Typography, Card, CardContent, Paper, Button } from "@mui/material";

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
    <Box
      sx={{
        padding: "0 100px",
        backgroundColor: "rgba(74, 131, 229, 0.556)",
        height: "100vh",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: `url(${Airplane})`,
          backgroundSize: "100%",
          backgroundColor: "rgba(210, 225, 255, 0.83)",
          backgroundBlendMode: "soft-light",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ width: "100%", marginBottom: "15px" }}>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid rgb(227, 227, 228)",
              borderRadius: "5px",
              backgroundColor: "white",
            }}
          >
            <FlightTakeoffIcon
              sx={{
                fontSize: 25,
                color: "rgb(56, 75, 218)",
                mb: 1,
                ml: 1,
                mr: 1,
              }}
            />
            <h3 style={{ fontWeight: "500" }}>Flight Search</h3>
          </Box>
        </div>
        <div
          style={{
            width: "95%",
            height: "100%",
          }}
        >
          <Card sx={{ mb: 3, height:"90%" }}>
            <CardContent sx={{ display: "flex" }}>
              <Box sx={{ width: "70%"}}>
                {flight.segments.map((segment: Segment, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 6,
                      ml: 3,
                      border:"1px solid #ccc",
                      height:"220px",
                      padding:"12px",
                    }}
                  >
                    <Typography variant="h6">
                      Segment {index + 1} - {segment.departureLoc} →{" "}
                      {segment.arrivalLoc}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                     
                      }}
                    >
                      <Box>
                        <Typography>
                          <strong>{formatDate(segment.departureTime)}</strong>{" "}
                          {formatTime(segment.departureTime)} -{" "}
                          <strong>{formatDate(segment.departureTime)}</strong>{" "}
                          {formatTime(segment.arrivalTime)}
                        </Typography>
                        {index < flight.segments.length - 1 && (
                          <Typography variant="body2" sx={{ color: "gray" }}>
                            Layover: {flight.layoverDurations[index]}
                          </Typography>
                        )}
                        <Typography>
                          <strong>Airline Code:</strong> {segment.carrierCode}
                        </Typography>
                        <Typography>
                          {" "}
                          <strong>Flight Number:</strong> {segment.flightNumber}
                        </Typography>
                        <Typography>
                          {" "}
                          <strong> Cabin Class:</strong> {segment.cabin}
                        </Typography>
                        <Typography>
                          <strong>Checked Bags Included:</strong>{" "}
                          {segment.includedCheckedBagsQuantity}
                        </Typography>
                      </Box>
                      <Box>
                        {segment.amenities.length > 0 ? (
                          <ul style={{ margin: 0, paddingLeft: "1.5em" }}>
                            {" "}
                            <strong>Amenities:</strong>
                            {segment.amenities.map((a, i) => (
                              <li key={i} style={{ listStyle: "none" }}>
                                {a.description}
                                {a.chargeable ? "(Chargeable)" : "(Free)"}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <Typography>No amenities listed.</Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{width:"35%", pl:10, height:"500px", border:"1px solid gray"}}>
                <Typography variant="h6">Price Breakdown</Typography>
                <div style={{height:"2px", backgroundColor:"black"}}></div>
                <Typography sx={{ mt: 2, fontSize:"18px" }}>
                  Base Fare Total: {flight.currency} ${totalBase.toFixed(2)}
                </Typography>
                <Typography sx={{ mt: 2, fontSize:"18px" }}>
                  Estimated Fees: {flight.currency} ${totalFees.toFixed(2)}
                </Typography>
                <Typography sx={{ mt: 2, fontSize:"18px" }}>
                  Total Price: {flight.currency} ${totalPrice.toFixed(2)}
                </Typography>
                <Button variant="contained" sx={{mt:8}}>Book</Button>
              </Box>
              
            </CardContent>
          </Card>
        </div>
      </Paper>
    </Box>
  );
}

export default DetailsPage;
