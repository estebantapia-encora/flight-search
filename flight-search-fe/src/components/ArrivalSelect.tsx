import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Box, Typography } from "@mui/material";

type ArrivalSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ArrivalSelect({ value, onChange }: ArrivalSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <>
      <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
        <Typography sx={{ width: "25%", fontWeight: "300" }}>
          Arrival Airport
        </Typography>
        <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
          <InputLabel id="arrival-select-label">Where To?</InputLabel>
          <Select
            labelId="arrival-select-label"
            id="arrival-select"
            value={value}
            name="destination"
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
