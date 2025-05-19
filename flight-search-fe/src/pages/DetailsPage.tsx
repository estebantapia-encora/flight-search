import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { Flight, Segment } from "../types/Flight";
import Airplane from "../assets/AirplaneBackground.jpg";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { Box, Typography, Card, Paper, Button } from "@mui/material";
import ReturnToResultsButton from "../components/ReturnToResultsButton";
import {
  setSelectedDeparture,
  setSelectedReturn,
} from "../redux/searchResultsSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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
  console.log("🔍 DetailsPage loaded with flight ID:", id);
  console.log("📦 Flight found:", flight);

  if (!flight) return <div>Flight not found.</div>;

  const totalPrice = parseFloat(flight.price);
  const totalBase = parseFloat(flight.segments[0].basePrice);
  const totalFees = totalPrice - totalBase;
  const finalPrice = flight.adults * totalPrice;
  const currencySymbol = flight.currency === "EUR" ? "€" : "$";
  const originAirport = useSelector(
    (state: RootState) => state.searchResults.originAirport
  );
  const destinationAirport = useSelector(
    (state: RootState) => state.searchResults.destinationAirport
  );
  const getCityName = (iata: string): string => {
    if (iata === originAirport?.iataCode) return originAirport.cityName;
    if (iata === destinationAirport?.iataCode)
      return destinationAirport.cityName;
    return iata; // fallback if not found
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const returnFlightsExist = useSelector((state: RootState) =>
    state.searchResults.results.some((f) => f.returnFlight)
  );

const handleBook = () => {
  if (!flight.returnFlight) {
    dispatch(setSelectedDeparture(flight));
    
    // Force redirect AFTER a short delay so the store is updated
    setTimeout(() => {
      if (returnFlightsExist) {
        navigate("/results"); // go select return flight
      } else {
        navigate("/summary"); // one-way
      }
    }, 0);
  } else {
    dispatch(setSelectedReturn(flight));
    navigate("/summary");
  }
};


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
        <Box sx={{ display: "flex", width: "90%", justifyContent: "center" }}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            <Typography sx={{ fontSize: "18px", fontWeight: "600", mb: 2 }}>
              Total Duration: {flight.formattedDuration}
            </Typography>

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
                  height: "270px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Typography
                    style={{
                      fontSize: "19px",
                      fontWeight: "600",
                      width: "100%",
                      paddingLeft: "24px",
                      marginBottom: "5px",
                    }}
                  >
                    Segment {index + 1} - {getCityName(segment.departureLoc)} →{" "}
                    {getCityName(segment.arrivalLoc)}
                    {index > 0 && (
                      <span
                        style={{
                          color: "gray",
                          marginLeft: 15,
                          fontSize: "15px",
                          fontWeight: "500",
                        }}
                      >
                        Layover: {flight.layoverDurations[index - 1]}
                      </span>
                    )}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", pl: 3, pr: 3, height: "100%" }}>
                  <Box sx={{ height: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        height: "90%",
                        pr: 5,
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderRight: "1px solid rgba(213, 213, 213, 0.84)",
                      }}
                    >
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

                      <Typography>
                        <span style={{ fontWeight: "500" }}>Airline:</span>{" "}
                        {flight.airline} ({segment.carrierCode})
                      </Typography>

                      <Typography>
                        <span style={{ fontWeight: "500" }}>
                          Flight Number:
                        </span>{" "}
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
                  </Box>

                  <Box sx={{ mt: 1, ml: 5 }}>
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
            <ReturnToResultsButton />
          </Box>
          <Card
            sx={{
              pt: 2,
              pb: 2,
              pl: 2,
              mb: 3,
              mt: 5,
              border: "1px solid #ccc",
              backgroundColor: "white",
              width: "35%",
              height: "330px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ fontSize: "20px", fontWeight: "500" }}>
              Price Breakdown ({flight.currency})
            </Typography>
            <div
              style={{
                color: "rgba(58, 54, 54, 0.84)",
              }}
            >
              - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              - - -{" "}
            </div>
            <Box sx={{ mb: 2, width: "92%" }}>
              <Box>
                <Typography
                  sx={{
                    mt: 1,
                    fontSize: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontWeight: "500" }}>
                    Base Fare Per Traveler:
                  </span>{" "}
                  {currencySymbol}
                  {Number(totalBase).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    fontSize: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontWeight: "500" }}>Estimated Fees:</span>{" "}
                  {currencySymbol}
                  {Number(totalFees).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    fontSize: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontWeight: "500" }}>Total Per Traveler:</span>{" "}
                  {currencySymbol}
                  {Number(totalPrice).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              </Box>
              <Typography sx={{ mt: 2 }}>
                {flight.adults} {""}
                {flight.adults > 1 ? `Adults` : `Adult`}
                <div
                  style={{
                    color: "rgba(58, 54, 54, 0.84)",
                  }}
                >
                  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                  - - - -
                </div>
              </Typography>
              <Typography
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                {" "}
                <span style={{ fontWeight: "500" }}>Total Price:</span>
                {currencySymbol}
                {Number(finalPrice).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
        <Button
  variant="contained"
  sx={{ mt: 8, width: "80%", margin: "0 auto" }}
  onClick={handleBook}
>
  {flight.returnFlight ? "Select and go to summary" : "Book"}
</Button>

          </Card>
        </Box>
      </Paper>
    </Box>
  );
}

export default DetailsPage;
