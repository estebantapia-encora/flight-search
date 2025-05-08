import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box } from '@mui/material';
import {FormControl} from '@mui/material';
import {Typography} from '@mui/material';


export default function ReturnDate() {
  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
      <Typography style={{ width: "25%", margin: 0, fontWeight:"300" }}>Return Date</Typography>
      <FormControl sx={{ m: 1}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Return Date" />
        </LocalizationProvider>
      </FormControl>
    </Box>
  );
}
