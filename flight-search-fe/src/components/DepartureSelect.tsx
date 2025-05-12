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
    
        console.log("Fetched airport data:", data); // for debugging
    
        if (Array.isArray(data)) {
          setOptions(data);
        } else {
          console.error("Expected array but got:", data);
          setOptions([]);
        }
      } catch (err) {
        console.error("Failed to fetch airports", err);
        setOptions([]);
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
        onChange={(_, newValue) => {
          // Extract IATA code from "Los Angeles Intl (LAX)"
          const match = /\(([^)]+)\)/.exec(newValue || "");
          const iataCode = match ? match[1] : "";
          onChange(iataCode);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Where From?" variant="outlined" />
        )}
        freeSolo
      />
    </Box>
    </>
  );
}
