import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Travel from "../assets/Travel.png";
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
            backgroundColor:"rgb(251, 251, 251)"
          }}
        >
          <img src={Travel} alt="Travel" style={{ height: "100%" }} />
          <SearchModule />
        </Paper>
      </Box>
    </>
  );
}

export default SearchPage;
