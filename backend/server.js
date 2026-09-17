const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Task Management API is running"
    });
});

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});