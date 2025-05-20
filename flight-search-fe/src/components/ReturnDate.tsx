import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Typography } from "@mui/material";
import { FormControl } from "@mui/material";
import type { Dayjs } from "dayjs";

type ReturnDateProps = {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  minDate: Dayjs | null;
};

export default function ReturnDate({ value, onChange, minDate }: ReturnDateProps) {

  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
      <Typography style={{ width: "25%", margin: 0, fontWeight: "300" }}>
        Return Date
      </Typography>
      <FormControl sx={{ m: 1 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Return Date"
            value={value}
            minDate={minDate?.add(1, "day")}
            disabled={!minDate}
            onChange={(newValue) => {
              console.log("📅 Picked date:", newValue);
              onChange(newValue); // ✅ call the real onChange prop
            }}
            slotProps={{
              textField: {
                id: "return-date",
                name: "returnDate",
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>
    </Box>
  );
}
