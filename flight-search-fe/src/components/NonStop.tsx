import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { Box } from '@mui/material';
import {Typography} from '@mui/material';
const label = { inputProps: { 'aria-label': 'Checkbox' } };

export default function NonStop() {
  return (
    <>
   <Box sx={{width: "100%", display: "flex", alignItems: "center" }}>
   <Typography style={{width:"25%", fontWeight:"300"}}>Non-stop</Typography>
      <Checkbox {...label} />
      </Box>
      </>
  );
}