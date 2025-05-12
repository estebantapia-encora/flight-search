import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";

type CurrencyProps = {
  value: string;
  onChange: (value: string) => void;
};
export default function Currency({ value, onChange }: CurrencyProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <>
      <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
        <Typography sx={{ width: "25%", fontWeight: "300" }}>
          Currency
        </Typography>
        <FormControl sx={{ m: 1, minWidth: 110 }} size="small">
          <InputLabel id="currency-label">Currency</InputLabel>
          <Select
            labelId="currency-label"
            id="currency"
            name="currency"
            value={value}
            onChange={handleChange}
          >
            <MenuItem value={"USD"}>USD</MenuItem>
            <MenuItem value={"MXN"}>MXN</MenuItem>
            <MenuItem value={"EUR"}>EUR</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  );
}
