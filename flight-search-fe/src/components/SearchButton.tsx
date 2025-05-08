import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

export default function SearchButton() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/results");
  };
  return (
    <>
      <Button 
      variant="contained" 
      size="large" 
      onClick={handleClick}
      sx={{ width: "15%" }}>
        Search
      </Button>
    </>
  );
}
