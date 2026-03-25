function Home() {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>🚑 Smart Healthcare Allocation</h1>

      <p>Find the best hospital instantly using AI</p>

      <button
        onClick={() => (window.location.href = "/patient")}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          borderRadius: "8px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Go to Patient Portal
      </button>

      <br /><br />

      <button
        onClick={async () => {
          const res = await fetch("https://healthcare-allocator.onrender.com/allocate/recommend", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ symptoms: "critical emergency" })
          });

          const data = await res.json();
          localStorage.setItem("result", JSON.stringify(data));
          window.location.href = "/result";
        }}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        🚑 Emergency Mode
      </button>
    </div>
  );
}

export default Home;