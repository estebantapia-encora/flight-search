import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import AirplaneBackground from "../assets/AirplaneBackground.jpg";
import { Box } from "@mui/material";
import { Paper } from "@mui/material";

import "../App.css";
import SearchModule from "../components/SearchModule";

function SearchPage() {
  return (
    <>
      <Box className="background-color">
        <Paper
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            borderRadius: "10px",
            overflow: "hidden",
            backgroundColor: "rgb(251, 251, 251)",
          }}
        >
          <Box sx={{ width: "65%", overflow: "hidden" }}>
            <img
              src={AirplaneBackground}
              alt="Travel"
              style={{
                height: "100%",
                transform: "scale(1.1) translateX(-20%)",
              }}
            />
          </Box>
          <SearchModule />
        </Paper>
      </Box>
    </>
  );
}

export default SearchPage;
