import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

type NonStopProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function NonStop({ value, onChange }: NonStopProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <>
      <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
        <Typography style={{ width: "25%", fontWeight: "300" }}>
          Non-stop
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              id="nonstop"
              name="nonstop"
              checked={value}
              onChange={handleChange}
            />
          }
          label="Non-stop"
        />
      </Box>
    </>
  );
}
