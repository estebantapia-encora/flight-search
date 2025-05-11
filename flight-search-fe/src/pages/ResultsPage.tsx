import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { Paper } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ReturnToSearchButton from "../components/ReturnToSearchButton";
import Airplane from "../assets/AirplaneBackground.jpg";

type Flight = {
  id: string;
  departureTime: string;
  arrivalTime: string;
  from: string;
  to: string;
  duration: string;
  airline: string;
  stops: string;
  currency: string;
  price: number;
  pricePerPerson: number;
};

export default function ResultsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    // Replace this with a real fetch call later
    const Flights: Flight[] = [
      {
        id: "1",
        departureTime: "1:25pm",
        arrivalTime: "4:50pm",
        from: "PHX",
        to: "LAX",
        duration: "1h 25m",
        airline: "Delta",
        stops: "1",
        currency: "MXN",
        price: 140.0,
        pricePerPerson: 40.0,
      },
      {
        id: "2",
        departureTime: "1:25pm",
        arrivalTime: "4:50pm",
        from: "PHX",
        to: "LAX",
        duration: "1h 30m",
        airline: "American Airlines",
        stops: "Nonstop",
        currency: "MXN",
        price: 120.0,
        pricePerPerson: 40.0,
      },
      {
        id: "3",
        departureTime: "1:25pm",
        arrivalTime: "4:50pm",
        from: "PHX",
        to: "LAX",
        duration: "1h 30m",
        airline: "Aeromexico",
        stops: "2",
        currency: "MXN",
        price: 120.0,
        pricePerPerson: 40.0,
      },
    ];
    setFlights(Flights);
  }, []);

  return (
    <Box className="background-color">
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: `url(${Airplane})`,
          backgroundSize: "110%",
          backgroundPosition: "-175% center",
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

        {flights.map((flight) => (
          <Card key={flight.id} sx={{ mb: 4, width: "65%" }}>
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
                  {flight.departureTime} - {flight.arrivalTime}
                </Typography>
                <Typography>{flight.airline}</Typography>
                <Button
                  variant="outlined"
                  size="medium"
                  sx={{ mt: 1 }}
                  onClick={() => console.log("Go to details", flight.id)}
                >
                  View Details
                </Button>
              </Box>
              <Box>
                {" "}
                <Typography sx={{ fontWeight: "600", fontSize: "16px" }}>
                  {flight.from} → {flight.to} ({flight.duration})
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: "600", fontSize: "16px" }}>
                  Stops: {flight.stops}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600 }}>
                  {flight.currency} ${flight.price.toFixed(2)}
                  <Typography sx={{ display: "inline" }}> Total</Typography>
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  {flight.currency} ${flight.pricePerPerson.toFixed(2)}
                  <Typography sx={{ display: "inline" }}>
                    {" "}
                    Per Traveler
                  </Typography>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Paper>
    </Box>
  );
}
