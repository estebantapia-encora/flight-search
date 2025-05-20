import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useState, useMemo } from "react";
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
  const [sortBy, setSortBy] = useState<"price" | "duration" | null>(null);

  const originAirport = useSelector(
    (s: RootState) => s.searchResults.originAirport
  );
  const destinationAirport = useSelector(
    (s: RootState) => s.searchResults.destinationAirport
  );

  const departingFlights = useMemo(() => {
    return [...allFlights]
      .filter((f) => !f.returnFlight)
      .slice(0, 4)
      .sort((a, b) =>
        sortBy === "price"
          ? parseFloat(a.totalPrice) - parseFloat(b.totalPrice)
          : sortBy === "duration"
          ? toMinutes(a.formattedDuration) - toMinutes(b.formattedDuration)
          : 0
      );
      

  }, [allFlights, sortBy]);

  const returnFlights = useMemo(() => {
    return [...allFlights]
      .filter((f) => f.returnFlight)
      .slice(0, 4)

      .sort((a, b) =>
        sortBy === "price"
          ? parseFloat(a.totalPrice) - parseFloat(b.totalPrice)
          : sortBy === "duration"
          ? toMinutes(a.formattedDuration) - toMinutes(b.formattedDuration)
          : 0
      )
      .slice(0, 4);
  }, [allFlights, sortBy]);

  const selectedDeparture = useSelector(
    (s: RootState) => s.searchResults.selectedDeparture
  );

  function toMinutes(duration: string): number {
    const [h, , m] = duration.split(" ");
    return (parseInt(h) || 0) * 60 + (parseInt(m) || 0);
  }

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
          backgroundColor: "rgba(220, 230, 252, 0.96)",
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
              borderBottom: "1px solid rgb(237, 237, 239)",
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

          {!selectedDeparture && (
            <>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: "500", width: "65%", fontSize: "24px" }}
              >
                Departing Flights
              </Typography>

              {departingFlights.length === 0 ? (
                <p>No flights found.</p>
              ) : (
                <div style={{ width: "65%" }}>
                  {departingFlights.length > 0 && (
                    <>
                      <Typography
                        variant="h1"
                        gutterBottom
                        sx={{
                          fontWeight: "400",
                          fontSize: "20px",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            {originAirport?.cityName} ({originAirport?.iataCode}
                            ) → {destinationAirport?.cityName} (
                            {destinationAirport?.iataCode})
                          </Box>
                          <Box
                            sx={{
                              width: "45%",
                              mb: 2,
                              display: "flex",
                              gap: 2,
                              justifyContent: "flex-end",
                            }}
                          >
                            <Button
                              sx={{ fontSize: "15px" }}
                              variant={
                                sortBy === "duration" ? "outlined" : "text"
                              }
                              onClick={() => setSortBy("duration")}
                            >
                              Sort by Duration
                            </Button>
                            <Button
                              sx={{ fontSize: "15px" }}
                              variant={sortBy === "price" ? "outlined" : "text"}
                              onClick={() => setSortBy("price")}
                            >
                              Sort by Price
                            </Button>
                          </Box>
                        </Box>
                      </Typography>
                    </>
                  )}
                  {departingFlights.map((flight, index) => (
                    <Card key={index} sx={{ mb: 4, width: "100%" }}>
                      <CardContent
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          position: "relative",
                          height: "150px",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          {" "}
                          <Typography
                            sx={{ fontWeight: "600", fontSize: "16px" }}
                          >
                            {flight.formattedTimeRange}
                          </Typography>
                          <Typography>{flight.airline}</Typography>
                        </Box>
                        <Box>
                          <Typography
                            sx={{ fontWeight: "600", fontSize: "16px" }}
                          >
                            {flight.numberOfStops === 0
                              ? "Non-stop"
                              : `Stops: ${flight.numberOfStops} (${flight.stops})`}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{ fontWeight: "400", fontSize: "16px" }}
                          >
                            {" "}
                            {flight.formattedDuration}
                          </Typography>
                        </Box>

                        <Box>
                          {flight.currency && (
                            <Typography
                              sx={{ fontSize: "16px", fontWeight: "500" }}
                            >
                              Currency: {flight.currency}
                            </Typography>
                          )}
                          <Typography sx={{ fontWeight: 600 }} component="div">
                            {flight.currency === "EUR"
                              ? `€${flight.totalPrice}`
                              : `$${flight.totalPrice}`}
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                            >
                              {" "}
                              Total Price
                            </Typography>
                          </Typography>

                          <Typography sx={{ fontWeight: 600 }} component="div">
                            {flight.currency === "EUR"
                              ? `€${flight.price}`
                              : `$${flight.price}`}
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                            >
                              {" "}
                              Per Traveler
                            </Typography>
                          </Typography>

                          <Button
                            variant="text"
                            size="medium"
                            sx={{ mt: 1, position: "absolute", right: "20px" }}
                            onClick={() => navigate(`/details/${flight.id}`)}
                          >
                            View Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {selectedDeparture && returnFlights.length > 0 && (
            <>
              <div style={{ width: "65%" }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: "500",
                    width: "100%",
                    fontSize: "24px",
                    mt: 5,
                  }}
                >
                  Returning Flights
                </Typography>


                <Typography
                  variant="h1"
                  gutterBottom
                  sx={{
                    fontWeight: "400",
                    fontSize: "20px",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      {destinationAirport?.cityName} (
                      {destinationAirport?.iataCode}) →{" "}
                      {originAirport?.cityName} ({originAirport?.iataCode})
                    </Box>
                    <Box
                      sx={{
                        width: "45%",
                        mb: 2,
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        sx={{ fontSize: "15px" }}
                        variant={sortBy === "duration" ? "outlined" : "text"}
                        onClick={() => setSortBy("duration")}
                      >
                        Sort by Duration
                      </Button>
                      <Button
                        sx={{ fontSize: "15px" }}
                        variant={sortBy === "price" ? "outlined" : "text"}
                        onClick={() => setSortBy("price")}
                      >
                        Sort by Price
                      </Button>
                    </Box>
                  </Box>
                </Typography>
                {returnFlights.map((flight, index) => (
                  <Card key={`return-${index}`} sx={{ mb: 4, width: "100%" }}>
                    <CardContent
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "relative",
                        height: "150px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: "600", fontSize: "16px" }}
                        >
                          {flight.formattedTimeRange}
                        </Typography>
                        <Typography>{flight.airline}</Typography>
                      </Box>
                      <Box>
                        <Typography
                          sx={{ fontWeight: "600", fontSize: "16px" }}
                        >
                          {flight.numberOfStops === 0
                            ? "Non-stop"
                            : `Stops: ${flight.numberOfStops} (${flight.stops})`}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: "400", fontSize: "16px" }}
                        >
                          {flight.formattedDuration}
                        </Typography>
                      </Box>
                      {flight.currency && (
                        <Typography
                          sx={{ fontSize: "16px", fontWeight: "500" }}
                        >
                          Currency: {flight.currency}
                        </Typography>
                      )}
                      <Box>
                        <Typography sx={{ fontWeight: 600 }} component="div">
                          {flight.currency === "EUR"
                            ? `€${flight.totalPrice}`
                            : `$${flight.totalPrice}`}
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                          >
                            {" "}
                            Total Price
                          </Typography>
                        </Typography>

                        <Typography sx={{ fontWeight: 600 }} component="div">
                          {flight.currency === "EUR"
                            ? `€${flight.price}`
                            : `$${flight.price}`}
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                          >
                            {" "}
                            Per Traveler
                          </Typography>
                        </Typography>

                        <Button
                          variant="text"
                          size="medium"
                          sx={{ mt: 1, position: "absolute", right: "20px" }}
                          onClick={() => navigate(`/details/${flight.id}`)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </Paper>
    </Box>
  );
}
