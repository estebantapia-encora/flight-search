import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Typography } from "@mui/material";
import { FormControl } from "@mui/material";
import type { Dayjs } from "dayjs";

type DepartureDateProps = {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
};

export default function DepartureDate({ value, onChange }: DepartureDateProps) {
  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
      <Typography style={{ width: "25%", margin: 0, fontWeight: "300" }}>
        Departure Date *
      </Typography>
      <FormControl sx={{ m: 1 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Departure Date"
            value={value}
            onChange={(newValue) => {
              console.log("📅 Picked date:", newValue);
              onChange(newValue); // ✅ call the real onChange prop
            }}
            slotProps={{
              textField: {
                id: "departure-date",
                name: "departureDate",
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>
    </Box>
  );
}
