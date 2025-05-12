import {useState, useEffect} from "react";
import { Box, Typography, Autocomplete, TextField } from "@mui/material";

type DepartureSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function DepartureSelect({ value, onChange }: DepartureSelectProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (inputValue.length < 2) return;

    const fetchAirports = async () => {
      try {
        const response = await fetch(`/api/airports/search?keyword=${inputValue}`);
        const data = await response.json();
        setOptions(data); // e.g. ["Los Angeles (LAX)", "London Heathrow (LHR)"]
      } catch (err) {
        console.error("Failed to fetch airports", err);
      }
    };

    const delayDebounce = setTimeout(fetchAirports, 300); // debounce input

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  return (
    <>
       <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
      <Typography sx={{ width: "25%", fontWeight: "300" }}>
        Departure Airport
      </Typography>
      <Autocomplete
        sx={{ m: 1, width: 250 }}
        size="small"
        options={options}
        value={value}
        onInputChange={(_, newInput) => setInputValue(newInput)}
        onChange={(_, newValue) => onChange(newValue || "")}
        renderInput={(params) => (
          <TextField {...params} label="Where From?" variant="outlined" />
        )}
        freeSolo
      />
    </Box>
    </>
  );
}
