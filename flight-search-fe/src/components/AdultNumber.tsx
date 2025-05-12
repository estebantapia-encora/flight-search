import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

type AdultNumberProps = {
  value: number;
  onChange: (value: number) => void;
};


export default function AdultNumber({ value, onChange }: AdultNumberProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
      <Typography sx={{ width: "25%", margin: 0, fontWeight:"300" }}>Number of Adults</Typography>
      <TextField
        id="adults"
        name="adults"
        label="Adults"
        variant="standard"
        size="small"
        value={value}
        onChange={handleChange}
        type="number"
        sx={{ width: "fit-content", ml: 1 }}
        inputProps={{ min: 1 }}
      />
    </Box>
  );
}
