import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

type SearchButtonProps = {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
};

export default function SearchButton({
  onClick,
  loading,
  disabled,
}: SearchButtonProps) {
  return (
    <>
      <Button
        variant="contained"
        size="large"
        onClick={onClick}
        disabled={disabled || loading}
        sx={{ width: "15%" }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Search"}
      </Button>
    </>
  );
}
