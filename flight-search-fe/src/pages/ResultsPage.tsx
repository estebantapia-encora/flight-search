import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export default function ResultsPage() {
  const flights = useSelector((state: RootState) => state.searchResults.results);

  return (
    <div>
      <h2>Raw Flight Data</h2>
      <pre>{JSON.stringify(flights, null, 2)}</pre>
    </div>
  );
}
