import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export default function ResultsPage() {
  const flights = useSelector((state: RootState) => state.searchResults.results);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Flight Results</h2>
      {flights.length === 0 ? (
        <p>No flights found.</p>
      ) : (
        <ul>
          {flights.map((flight, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <strong>{flight.departure} → {flight.arrival}</strong><br />
              Airline: {flight.airline}<br />
              Time: {flight.formattedTimeRange}<br />
              Duration: {flight.formattedDuration}<br />
              Price: {flight.currency} ${flight.price}<br />
              Stops: {flight.numberOfStops} ({flight.stops})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
