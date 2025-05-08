import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Box, Typography } from "@mui/material";


export default function DepartureSelect() {
  const [to, setTo] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setTo(event.target.value);
  };

  return (
    <>
      <Box sx={{width: "100%", display: "flex", alignItems: "center" }}>
        <Typography sx={{width:"25%", fontWeight:"300"}}>Arrival Airport</Typography>
        <FormControl sx={{ m: 1, minWidth: 150}} size="small">
          <InputLabel id="demo-select-small-label">Where To?</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={to}
            label="Where From?"
            onChange={handleChange}
          >
            <MenuItem value={"HMO"}>HMO</MenuItem>
            <MenuItem value={"LAX"}>LAX</MenuItem>
            <MenuItem value={"PHX"}>PHX</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  );
}
