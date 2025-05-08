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

export default function SearchModule() {
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
          <Box sx={{ display: "flex", alignItems:"center" }}>
            <FlightTakeoffIcon
              sx={{ fontSize: 25, color: "rgb(56, 75, 218)", mb: 1, mr:1 }}
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
        <DepartureSelect />
        <ArrivalSelect />
        <DepartureDate />
        <ReturnDate />
        <AdultNumber />
        <Currency />
        <NonStop />
        <SearchButton />
      </Box>
    </>
  );
}
