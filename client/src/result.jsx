import { useEffect, useState } from "react";

function Result() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("result"));
    setData(stored);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}>
      <div style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "15px",
        width: "350px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>
        <h2>🏥 {data.hospital.name}</h2>

        <p>⏱ Wait Time: {data.hospital.waitTime} mins</p>
        <p>🚨 Urgency: {data.urgency}</p>

        <p style={{ marginTop: "10px", fontStyle: "italic" }}>
          💡 {data.reason}
        </p>

        <p style={{
          marginTop: "15px",
          fontSize: "12px",
          color: "gray"
        }}>
          Recommended based on ICU availability, low wait time, and AI symptom analysis.
        </p>

        <button 
          onClick={() => window.location.href = "/"}
          style={{
            marginTop: "20px",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            background: "#009688",
            color: "white"
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Result;