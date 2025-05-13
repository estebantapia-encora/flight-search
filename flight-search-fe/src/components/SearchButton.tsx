import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

type SearchButtonProps = {
  onClick: () => void;
  loading: boolean;
};

export default function SearchButton({ onClick, loading }: SearchButtonProps) {
  return (
    <>
      <Button
        variant="contained"
        size="large"
        onClick={onClick}
        disabled={loading}
        sx={{ width: "15%", position: "relative" }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Search"}
      </Button>
    </>
  );
}
