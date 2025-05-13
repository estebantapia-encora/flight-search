import Button from "@mui/material/Button";

type SearchButtonProps = {
  onClick: () => void;
};

export default function SearchButton({onClick}:SearchButtonProps) {

  return (
    <>
      <Button 
      variant="contained" 
      size="large" 
      onClick={onClick}
      sx={{ width: "15%" }}>
        Search
      </Button>
    </>
  );
}
