import { useState } from "react";
import { useEffect } from "react";
import { Box } from "@mui/material";
import DepartureSelect from "./DepartureSelect";
import ArrivalSelect from "./ArrivalSelect";
import DepartureDate from "./DepartureDate";
import ReturnDate from "./ReturnDate";
import AdultNumber from "./AdultNumber";
import Currency from "./Currency";
import NonStop from "./NonStop";
import SearchButton from "./SearchButton";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { Dayjs } from "dayjs";

export default function SearchModule() {
  const [originLocationCode, setOriginLocationCode] = useState("");
  const [destinationLocationCode, setDestinationLocationCode] = useState("");
  const [departureDate, setDepartureDate] = useState<Dayjs | null>(null);
  const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
  const [adults, setAdults] = useState(1);
  const [currencyCode, setCurrencyCode] = useState("");
  const [nonStop, setNonStop] = useState(false);

  useEffect(() => {
    console.log("Origin:", originLocationCode);
    console.log("Destination:", destinationLocationCode);
    console.log(
      "Departure Date:",
      departureDate?.format("YYYY-MM-DD") || "None"
    );
    console.log("Return Date:", returnDate?.format("YYYY-MM-DD") || "None");
    console.log("Adults:", adults);
    console.log("Currency:", currencyCode);
    console.log("Non-stop:", nonStop);
  }, [
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults,
    currencyCode,
    nonStop,
  ]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          justifyContent: "center",
          width: "50%",
          height: "100%",
          marginLeft: "20px",
        }}
      >
        <div>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FlightTakeoffIcon
              sx={{ fontSize: 25, color: "rgb(56, 75, 218)", mb: 1, mr: 1 }}
            />
            <h3 style={{ fontWeight: "500" }}>Flight Search</h3>
          </Box>
          <h2 style={{ fontWeight: "500", color: "rgb(56, 75, 218)" }}>
            Where Would You Like To Go?
          </h2>
          <div
            style={{
              borderBottom: "2px solid rgb(189, 196, 250)",
              width: "50%",
              marginBottom: "20px",
            }}
          ></div>
        </div>
        <DepartureSelect value={originLocationCode} onChange={setOriginLocationCode}/>
        <ArrivalSelect value={destinationLocationCode} onChange={setDestinationLocationCode}/>
        <DepartureDate value={departureDate} onChange={setDepartureDate} />
        <ReturnDate value={returnDate} onChange={setReturnDate} />
        <AdultNumber value={adults} onChange={setAdults} />
        <Currency value={currencyCode} onChange={setCurrencyCode} />
        <NonStop value={nonStop} onChange={setNonStop} />
        <SearchButton />
      </Box>
    </>
  );
}
