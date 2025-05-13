import { useEffect, useState } from "react";
import { Box, Typography, Autocomplete, TextField } from "@mui/material";

type ArrivalSelectProps = {
  onChange: (value: string) => void; // gets called with IATA code
};

export default function ArrivalSelect({
  onChange,
}: ArrivalSelectProps) {
  
  const [options, setOptions] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (searchText.length < 2) return;

    const fetchAirports = async () => {
      const response = await fetch(`/api/airports/search?keyword=${searchText.toUpperCase()}`);
      const data = await response.json();
      setOptions(Array.isArray(data) ? data : []);
    };
  
    const delayDebounce = setTimeout(fetchAirports, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
      <Typography sx={{ width: "25%", fontWeight: "300" }}>
        Arrival Airport
      </Typography>
      <Autocomplete
        sx={{ m: 1, width: 250 }}
        size="small"
        options={options}
        inputValue={searchText}
  onInputChange={(_, newInput) => setSearchText(newInput)}
  onChange={(_, newValue) => {
    const match = /\(([^)]+)\)/.exec(newValue || "");
    const iataCode = match ? match[1] : "";
    onChange(iataCode);
  }}
        renderInput={(params) => (
          <TextField {...params} label="Where To?" variant="outlined" />
        )}
        freeSolo
      />
    </Box>
  );
}
