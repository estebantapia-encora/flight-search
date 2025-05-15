import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { Flight, Segment } from "../types/Flight";
import Airplane from "../assets/AirplaneBackground.jpg";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Button,
} from "@mui/material";

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
        width: "100%",
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
        <Box sx={{ display: "flex", width: "85%", justifyContent: "center" }}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              mr: 4,
            }}
          >
            {flight.segments.map((segment: Segment, index: number) => (

              <Card
                key={index}
                sx={{
                  pt: 2,
                  pb: 2,
                  mb: 3,
                  border: "1px solid #ccc",
                  backgroundColor: "white",
                  width: "85%",
                  height: "240px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  style={{
                    paddingLeft: "12px",
                    fontSize: "19px",
                    fontWeight: "600",
                  }}
                >
                  Segment {index + 1} - {segment.departureLoc} →{" "}
                  {segment.arrivalLoc}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 12px 12px 12px",
                  }}
                >
                  <Box>
                    <Typography>
                      <span style={{ fontWeight: "500" }}>
                        {formatDate(segment.departureTime)}{" "}
                      </span>
                      {formatTime(segment.departureTime)} -{" "}
                      <span style={{ fontWeight: "500" }}>
                        {formatDate(segment.departureTime)}{" "}
                      </span>
                      {formatTime(segment.arrivalTime)}
                    </Typography>
                    {index < flight.segments.length - 1 && (
                      <Typography variant="body2" sx={{ color: "gray" }}>
                        Layover: {flight.layoverDurations[index]}
                      </Typography>
                    )}
                    <Typography>
                      <span style={{ fontWeight: "500" }}>Airline Code:</span>{" "}
                      {segment.carrierCode}
                    </Typography>
                    <Typography>
                      <span style={{ fontWeight: "500" }}>Flight Number:</span>{" "}
                      {segment.flightNumber}
                    </Typography>
                    <Typography>
                      <span style={{ fontWeight: "500" }}> Cabin Class:</span>{" "}
                      {segment.cabin}
                    </Typography>
                    <Typography>
                      <span style={{ fontWeight: "500" }}>
                        Checked Bags Included:{" "}
                      </span>
                      {segment.includedCheckedBagsQuantity}
                    </Typography>
                  </Box>
                  <Box>
                    {segment.amenities.length > 0 ? (
                      <div>
                        {"  "}
                        <Typography sx={{ fontWeight: "500" }}>
                          Amenities
                        </Typography>
                        {segment.amenities.map((a, i) => (
                          <div key={i} style={{ listStyle: "none" }}>
                            {a.description}{" "}
                            <span
                              style={{
                                fontStyle: "italic",
                                fontSize: "14px",
                                color: "rgba(100, 150, 200)",
                              }}
                            >
                              {a.chargeable ? "(Chargeable)" : "(Free)"}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Typography>No amenities listed.</Typography>
                    )}
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          <Card
            sx={{
              pt: 2,
              pb: 2,
              pl: 2,
              mb: 3,
              border: "1px solid #ccc",
              backgroundColor: "white",
              width: "35%",
              height: "240px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{fontSize:"20px", fontWeight:"500"}}>Price Breakdown</Typography>
            <div
              style={{ height: "2px", backgroundColor: "rgb(27, 88, 192)", width: "95%" }}
            ></div>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ mt: 2, fontSize: "16px" }}>
                <span style={{fontWeight:"500"}}>Base Fare Total:</span> {flight.currency} ${totalBase.toFixed(2)}
              </Typography>
              <Typography sx={{ mt: 2, fontSize: "16px" }}>
                <span style={{fontWeight:"500"}}>Estimated Fees:</span> {flight.currency} ${totalFees.toFixed(2)}
              </Typography>
              <Typography sx={{ mt: 2, fontSize: "16px" }}>
                <span style={{fontWeight:"500"}}>Total Price:</span> {flight.currency} ${totalPrice.toFixed(2)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              sx={{ mt: 8, width: "50%", margin: "0 auto" }}
            >
              Book
            </Button>
          </Card>
        </Box>
      </Paper>
    </Box>
  );
}

export default DetailsPage;
