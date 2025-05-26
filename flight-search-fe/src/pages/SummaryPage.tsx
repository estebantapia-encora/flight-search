import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Box, Card, Typography, Paper, Button } from "@mui/material";
import ReturnToSearchButton from "../components/ReturnToSearchButton";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AirplaneBackground from "../assets/AirplaneBackground.jpg";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
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
  const originAirport = useSelector(
    (s: RootState) => s.searchResults.originAirport)!;
  const destinationAirport = useSelector(
    (s: RootState) => s.searchResults.destinationAirport)!;
  const depart = useSelector(
    (s: RootState) => s.searchResults.selectedDeparture)!;
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
  const format = (n: number) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formattedDeBase = format(deBase);
  const formattedDeFees = format(deFees);
  const formattedDeTotal = format(deTotal);

  const formattedReBase = format(reBase);
  const formattedReFees = format(reFees);
  const formattedReTotal = format(reTotal);

  const formattedPerBase = format(perBase);
  const formattedPerFees = format(perFees);
  const formattedPerTotal = format(perTotal);

  const formattedGrandTotal = format(grandTotal);

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
        <Paper
          sx={{
            maxWidth: 1300,
            width: "100%",
            mx: "auto",
            pt: 2,
            pl: 2,
            pb: 2,
          }}
        >
          <ReturnToSearchButton />
          <Typography
            variant="h5"
            gutterBottom
            sx={{ ml: 2, mt: 2, fontWeight: "500" }}
          >
            Booking Summary
          </Typography>
          {/* Departing flight summary */}
          <Box sx={{ display: "flex", width: "100%" }}>
            <Card
              variant="outlined"
              sx={{ mb: 2, p: 2, mx: "auto", width: "30%" }}
            >
              <Typography variant="h6">Outbound</Typography>
              <Typography>
                <span style={{ fontWeight: "500" }}> Route:</span>{" "}
                {originAirport.cityName} → {destinationAirport.cityName}
              </Typography>
              <Typography>
                <span style={{ fontWeight: "500" }}>Date:</span>{" "}
                {formatDate(depart.segments[0].departureTime)} @{" "}
                {formatTime(depart.segments[0].departureTime)} –{" "}
                {formatTime(depart.segments.slice(-1)[0].arrivalTime)}
              </Typography>
              <Typography>
                - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                - - - - - - - - -{" "}
              </Typography>
              <Typography sx={{ fontWeight: "600" }}>
                Fares
                <Typography>
                  <span style={{ fontWeight: 500 }}>Base: </span>
                  {depart.currency} {symbol}
                  {formattedDeBase}
                </Typography>
                <Typography>
                  {" "}
                  <span style={{ fontWeight: 500 }}>Fees: </span>
                  {depart.currency} {symbol}
                  {formattedDeFees}
                </Typography>
                <Typography>
                  <span style={{ fontWeight: 500 }}>Total: </span>
                  {depart.currency} {symbol}
                  {formattedDeTotal}
                </Typography>
              </Typography>
            </Card>
            {/* Returning flight summary if present */}
            {ret && (
              <Card
                variant="outlined"
                sx={{ mb: 2, p: 2, mx: "auto", width: "30%" }}
              >
                <Typography variant="h6">Return</Typography>
                <Typography>
                  <span style={{ fontWeight: "500" }}>Route:</span>{" "}
                  {destinationAirport.cityName} → {originAirport.cityName}
                </Typography>
                <Typography>
                  <span style={{ fontWeight: "500" }}>Date:</span>{" "}
                  {formatDate(ret.segments[0].departureTime)} @{" "}
                  {formatTime(ret.segments[0].departureTime)} –{" "}
                  {formatTime(ret.segments.slice(-1)[0].arrivalTime)}
                </Typography>
                <Typography>
                  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -{" "}
                </Typography>
                <Typography sx={{ fontWeight: "600" }}>
                  Fares
                  <Typography>
                    <span style={{ fontWeight: 500 }}>Base: </span>
                    {depart.currency} {symbol}
                    {formattedReBase}
                  </Typography>
                  <Typography>
                    {" "}
                    <span style={{ fontWeight: 500 }}>Fees: </span>
                    {depart.currency} {symbol}
                    {formattedReFees}
                  </Typography>
                  <Typography>
                    <span style={{ fontWeight: 500 }}>Total: </span>
                    {depart.currency} {symbol}
                    {formattedReTotal}
                  </Typography>
                </Typography>
              </Card>
            )}

            {/* Grand totals */}
            <Box sx={{ mt: 1, mx: "auto", width: "30%", pl: 10 }}>
              <Typography variant="h6">Combined per traveler:</Typography>
              <Typography>
                <span style={{ fontWeight: 500 }}>Base: </span>
                {depart.currency} {symbol}
                {formattedPerBase}
              </Typography>
              <Typography>
                <span style={{ fontWeight: 500 }}>Fees: </span>
                {depart.currency} {symbol}
                {formattedPerFees}
              </Typography>
              <Typography>
                <span style={{ fontWeight: 500 }}>Total: </span>
                {depart.currency} {symbol}
                {formattedPerTotal}
              </Typography>

              <Typography sx={{ mt: 2 }} variant="h6">
                Grand total ({numTrav} traveler{numTrav > 1 ? "s" : ""}):
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "400" }}>
                {depart.currency} {symbol}
                {formattedGrandTotal}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "end", mr: 14 }}>
            <Button
              variant="contained"
              size="medium"
              color="success"
              sx={{ mt: 1, width: "20%" }}
              onClick={() => {
                alert("✅ Booking confirmed!\nYour itinerary has been saved.");
              }}
            >
              Confirm Booking
              <AddShoppingCartIcon sx={{ ml: 1, fontSize: "18px" }} />
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
