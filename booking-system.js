const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());


let seats = {
  1: { status: "available" },
  2: { status: "available" },
  3: { status: "available" },
  4: { status: "available" },
  5: { status: "available" }
};


let locks = {};

app.get("/seats", (req, res) => {
  res.json(seats);
});


app.post("/lock/:id", (req, res) => {
  const seatId = req.params.id;

  if (!seats[seatId]) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (seats[seatId].status !== "available") {
    return res.status(400).json({ message: "Seat is not available" });
  }


  seats[seatId].status = "locked";

  if (locks[seatId]) clearTimeout(locks[seatId]);


  locks[seatId] = setTimeout(() => {
    if (seats[seatId].status === "locked") {
      seats[seatId].status = "available";
      delete locks[seatId];
    }
  }, 60000);

  res.json({ message: `Seat ${seatId} locked successfully. Confirm within 1 minute.` });
});


app.post("/confirm/:id", (req, res) => {
  const seatId = req.params.id;

  if (!seats[seatId]) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (seats[seatId].status !== "locked") {
    return res.status(400).json({ message: "Seat is not locked and cannot be booked" });
  }

 
  seats[seatId].status = "booked";


  if (locks[seatId]) {
    clearTimeout(locks[seatId]);
    delete locks[seatId];
  }

  res.json({ message: `Seat ${seatId} booked successfully!` });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
