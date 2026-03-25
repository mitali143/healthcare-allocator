import { useState } from "react";

function PatientPortal() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!symptoms) {
      alert("Please enter symptoms");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://healthcare-allocator.onrender.com/allocate/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          phone,
          symptoms
        })
      });

      const data = await res.json();

      localStorage.setItem("result", JSON.stringify(data));

      window.location.href = "/result";
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>🧑‍⚕️ Patient Portal</h2>

      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "10px",
          borderRadius: "8px"
        }}
      />

      <input
        type="text"
        placeholder="Enter Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "10px",
          borderRadius: "8px"
        }}
      />

      <textarea
        placeholder="Enter symptoms (fever, chest pain, breathing issue...)"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          marginTop: "10px",
          height: "100px"
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "15px",
          borderRadius: "8px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        {loading ? "Analyzing..." : "Get Recommendation"}
      </button>
    </div>
  );
}

export default PatientPortal;