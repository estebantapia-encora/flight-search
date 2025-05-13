import { useEffect, useState } from "react";
import { Box, Typography, Autocomplete, TextField } from "@mui/material";

type DepartureSelectProps = {
  value: string; // controlled input from parent
  onChange: (value: string) => void; // gets called with IATA code
};

export default function DepartureSelect({
  value,
  onChange,
}: DepartureSelectProps) {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (value.length < 2) return;

    const fetchAirports = async () => {
      try {
        const response = await fetch(
          `/api/airports/search?keyword=${value.toUpperCase()}`
        );
        const data = await response.json();

        console.log("Fetched airport data:", data); // Debug

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

    const delayDebounce = setTimeout(fetchAirports, 100);
    return () => clearTimeout(delayDebounce);
  }, [value]);

  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
      <Typography sx={{ width: "25%", fontWeight: "300" }}>
        Departure Airport
      </Typography>
      <Autocomplete
        sx={{ m: 1, width: 250 }}
        size="small"
        options={options}
        inputValue={value}
        onInputChange={(_, newInput) => onChange(newInput)}
        onChange={(_, newValue) => {
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
  );
}
