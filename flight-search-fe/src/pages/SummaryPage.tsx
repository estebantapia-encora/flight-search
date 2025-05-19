import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Box, Card, Typography, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReturnToSearchButton from "../components/ReturnToSearchButton";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AirplaneBackground from "../assets/AirplaneBackground.jpg";
import "../App.css";

// re‐use your formatting helpers:
function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function formatTime(time: string) {
  return new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SummaryPage() {
  const navigate = useNavigate();
  const originAirport = useSelector(
    (s: RootState) => s.searchResults.originAirport
  )!;
  const destinationAirport = useSelector(
    (s: RootState) => s.searchResults.destinationAirport
  )!;
  const depart = useSelector(
    (s: RootState) => s.searchResults.selectedDeparture
  )!;
  const ret = useSelector((s: RootState) => s.searchResults.selectedReturn);

  // compute per‑flight base, fees
  const deBase = parseFloat(depart.segments[0].basePrice);
  const deTotal = parseFloat(depart.price);
  const deFees = deTotal - deBase;

  let reBase = 0,
    reTotal = 0,
    reFees = 0;
  if (ret) {
    reBase = parseFloat(ret.segments[0].basePrice);
    reTotal = parseFloat(ret.price);
    reFees = reTotal - reBase;
  }

  // combined per‑traveler
  const perBase = deBase + reBase;
  const perFees = deFees + reFees;
  const perTotal = perBase + perFees;

  // all travelers
  const numTrav = depart.adults;
  const grandTotal = perTotal * numTrav;

  // currency symbol
  const symbol = depart.currency === "EUR" ? "€" : "$";

  return (
    <>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundSize: "100%",
          backgroundImage: "url(" + AirplaneBackground + ")",
          backgroundColor: "rgba(220, 230, 252, 0.96)",
          backgroundBlendMode: "soft-light",
          width: "100%",
        }}
      >
        <div style={{ width: "100%" }}>
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
      </Paper>

      <Box
        sx={{
          p: 4,
          backgroundImage: `url(${AirplaneBackground})`,
          backgroundSize: "cover",
          backgroundColor: "rgba(184, 203, 243, 0.72)",
          backgroundBlendMode: "soft-light",
          width: "100%",
          height: "100vh",
        }}
      >
        <Paper sx={{ maxWidth: 800, mx: "auto" }}>
          <ReturnToSearchButton />

          <Typography variant="h4" gutterBottom>
            Booking Summary
          </Typography>

          {/* Departing flight summary */}
          <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
            <Typography variant="h6">Outbound</Typography>
            <Typography>
              {originAirport.cityName} → {destinationAirport.cityName}
            </Typography>
            <Typography>
              {formatDate(depart.segments[0].departureTime)} @{" "}
              {formatTime(depart.segments[0].departureTime)} –{" "}
              {formatTime(depart.segments.slice(-1)[0].arrivalTime)}
            </Typography>
            <Typography>
              Base: {symbol}
              {deBase.toFixed(2)} | Fees: {symbol}
              {deFees.toFixed(2)} | Total: {symbol}
              {deTotal.toFixed(2)}
            </Typography>
          </Card>

          {/* Returning flight summary if present */}
          {ret && (
            <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
              <Typography variant="h6">Return</Typography>
              <Typography>
                {destinationAirport.cityName} → {originAirport.cityName}
              </Typography>
              <Typography>
                {formatDate(ret.segments[0].departureTime)} @{" "}
                {formatTime(ret.segments[0].departureTime)} –{" "}
                {formatTime(ret.segments.slice(-1)[0].arrivalTime)}
              </Typography>
              <Typography>
                Base: {symbol}
                {reBase.toFixed(2)} | Fees: {symbol}
                {reFees.toFixed(2)} | Total: {symbol}
                {reTotal.toFixed(2)}
              </Typography>
            </Card>
          )}

          {/* Grand totals */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Combined per traveler:</Typography>
            <Typography>
              Base: {symbol}
              {perBase.toFixed(2)} | Fees: {symbol}
              {perFees.toFixed(2)} | Total: {symbol}
              {perTotal.toFixed(2)}
            </Typography>
            <Typography sx={{ mt: 2 }} variant="h6">
              Grand total ({numTrav} traveler{numTrav > 1 ? "s" : ""}):
            </Typography>
            <Typography variant="h5">
              {symbol}
              {grandTotal.toFixed(2)}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            sx={{ mt: 4 }}
            onClick={() => {
              /* your final "confirm" handler */
            }}
          >
            Confirm Booking
          </Button>
        </Paper>
      </Box>
    </>
  );
}
