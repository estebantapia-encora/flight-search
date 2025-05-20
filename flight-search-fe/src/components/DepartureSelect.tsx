import { useEffect, useState } from "react";
import { Box, Typography, Autocomplete, TextField } from "@mui/material";

type DepartureSelectProps = {
  onChange: (airport: { cityName: string; iataCode: string }) => void;
};

export default function DepartureSelect({ onChange }: DepartureSelectProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (searchText.length < 2) return;

    const fetchAirports = async () => {
      const response = await fetch(
        `/api/airports/search?keyword=${searchText.toUpperCase()}`
      );
      const data = await response.json();
      setOptions(Array.isArray(data) ? data : []);
    };

    const delayDebounce = setTimeout(fetchAirports, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
      <Typography sx={{ width: "25%", fontWeight: "300" }}>
        Departure Airport *
      </Typography>
      <Autocomplete
        sx={{ m: 1, width: 250 }}
        size="small"
        options={options}
        inputValue={searchText}
        onInputChange={(_, newInput) => setSearchText(newInput)}
        onChange={(_, newValue) => {
          if (newValue) {
            const match = /\(([^)]+)\)/.exec(newValue); // extract (LAX)
            const iataCode = match ? match[1] : "";
            const cityName = newValue
              .split(" (")[0]
              .toLowerCase()
              .replace(/\b\w/g, (l) => l.toUpperCase());
            onChange({ cityName, iataCode });
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label="Where From?" variant="outlined" />
        )}
        freeSolo
      />
    </Box>
  );
}
