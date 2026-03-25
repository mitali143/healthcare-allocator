<button 
  onClick={handleEmergency}
  style={{
    background: "#e53935",
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    marginTop: "20px",
    border: "none",
    fontWeight: "bold"
  }}
>
  🚑 Emergency Mode
</button>
const handleEmergency = async () => {
  const res = await fetch("https://healthcare-allocator.onrender.com/allocate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ symptoms: "critical emergency" })
  });

  const data = await res.json();

  // redirect with data
  localStorage.setItem("result", JSON.stringify(data));
  window.location.href = "/patient-portal";
};