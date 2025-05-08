import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Box } from "@mui/material";
import {Typography} from "@mui/material";


export default function Currency() {
  const [currency, setCurrency] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setCurrency(event.target.value);
  };

  return (
    <>
      <Box sx={{width: "100%", display: "flex", alignItems: "center" }}>
        <Typography sx={{width:"25%", fontWeight:"300"}}>Currency</Typography>
        <FormControl sx={{ m: 1, minWidth: 110}} size="small">
        <InputLabel id="demo-select-small-label">Currency</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={currency}
            label="Where From?"
            onChange={handleChange}
          >
            <MenuItem value={"USD"}>USD</MenuItem>
            <MenuItem value={"MXN"}>MXN</MenuItem>
            <MenuItem value={"EUR"}>EUR</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  );
}
