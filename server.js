const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const dbConfig = require("./db");
const roomsRoute = require("./routes/roomsRoute");
const usersRoute = require("./routes/userRoute");
const bookingsRoute = require("./routes/bookingsRoute");

app.use(express.json());
app.use(cors());

app.use("/api/rooms", roomsRoute);
app.use("/api/users", usersRoute);
app.use("/api/bookings", bookingsRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Node Server Started on port ${port}`));
