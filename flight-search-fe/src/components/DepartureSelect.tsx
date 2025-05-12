import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Box, Typography } from "@mui/material";

type DepartureSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function DepartureSelect({ value, onChange }: DepartureSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <>
      <Box sx={{width: "100%", display: "flex", alignItems: "center" }}>
      <Typography sx={{width:"25%", fontWeight:"300"}}>Departure Airport</Typography>
        <FormControl sx={{ m: 1, minWidth: 150}} size="small">
          <InputLabel id="departure-select-label">Where From?</InputLabel>
          <Select
            labelId="departure-select-label"
            id="departure-select"
            value={value}
            name="origin"
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
