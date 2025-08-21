const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/friends", require("./routes/friendRoutes"));
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/ocr", require("./routes/ocrRoutes"));


const PORT = process.env.PORT ;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

