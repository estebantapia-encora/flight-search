import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Box } from "@mui/material";
import {Typography} from "@mui/material";


export default function DepartureSelect() {
  const [from, setFrom] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setFrom(event.target.value);
  };

  return (
    <>
      <Box sx={{width: "100%", display: "flex", alignItems: "center" }}>
      <Typography style={{width:"25%", fontWeight:"300"}}>Departure Airport</Typography>
        <FormControl sx={{ m: 1, minWidth: 150}} size="small">
          <InputLabel id="demo-select-small-label">Where From?</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={from}
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
