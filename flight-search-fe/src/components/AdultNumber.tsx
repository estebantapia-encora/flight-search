import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function AdultNumber() {
  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
      <Typography sx={{ width: "25%", margin: 0, fontWeight:"300" }}>Number of Adults</Typography>
  <TextField
        id="standard-basic"
        label="Adults"
        variant="standard"
        size="small"
        sx={{ width: "fit-content", ml: 1 }}
      />
    </Box>
  );
}
