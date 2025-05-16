import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

export default function SearchButton() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/results");
  }
  const arrow = "<"
  ;
  return (
    <>
      <Button 
      variant="contained" 
      size="medium" 
      onClick={handleClick}
      sx={{ width: "20%" }}>
         {arrow} Return To Results
      </Button>
    </>
  );
}
