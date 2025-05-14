import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ReturnToSearchButton from "../components/ReturnToSearchButton";
import Airplane from "../assets/AirplaneBackground.jpg";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function ResultsPage() {
  const allFlights = useSelector((s: RootState) => s.searchResults.results);
  const flights = allFlights.slice(0, 6);
  const navigate = useNavigate();

  return (
    <Box
      sx={{ padding: "0 100px", backgroundColor: "rgba(74, 131, 229, 0.556)" }}
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
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "65%", mb: 4, mt: 2 }}>
            <ReturnToSearchButton />
          </Box>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "500", width: "65%", fontSize: "22px" }}
          >
            Departing Flights
          </Typography>
          {flights.length === 0 ? (
            <p>No flights found.</p>
          ) : (
            <div style={{ width: "65%" }}>
              {flights.map((flight, index) => (
                <Card key={index} sx={{ mb: 4, width: "100%" }}>
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ fontWeight: "600", fontSize: "18px" }}>
                        {flight.departure} - {flight.arrival}
                      </Typography>
                      <Typography>{flight.airline}</Typography>
                      <Button
                        variant="outlined"
                        size="medium"
                        sx={{ mt: 1 }}
                        onClick={() => navigate(`/details/${flight.id}`)}
                      >
                        View Details
                      </Button>
                    </Box>
                    <Box>
                      {" "}
                      <Typography sx={{ fontWeight: "600", fontSize: "16px" }}>
                        {flight.from} → {flight.to} ({flight.formattedDuration})
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: "600", fontSize: "16px" }}>
                        Stops: {flight.numberOfStops} ({flight.stops})
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }} component="div">
                        {flight.currency} ${flight.price}
                        <Typography sx={{ display: "inline" }} component="span">
                          {" "}
                          Total
                        </Typography>
                      </Typography>
                      <Typography sx={{ fontWeight: 600 }} component="div">
                        {flight.currency} ${flight.price}
                        <Typography sx={{ display: "inline" }} component="span">
                          {" "}
                          Per Traveler
                        </Typography>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Paper>
    </Box>
  );
}
