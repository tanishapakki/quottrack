import { useState } from "react";

function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div>
      <h1>QuotTrack Dashboard</h1>
      <button onClick={() => setPage("clients")}>Clients</button>
      <p>{page}</p>
    </div>
  );
}

export default App;
