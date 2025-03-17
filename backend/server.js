const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const app = express();
const PORT = 7000;
const SECRET_KEY = "your_secret_key";

dotenv.config()
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Database connected"))
.catch((err) => console.error("Database connection failed:", err));

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

let users = [];

app.get("/",async(req,res)=>{
    res.send("Server is running")
})

app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
        
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, email, password: hashedPassword };
    users.push(newUser);

    const token = jwt.sign({ username, email }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Registration successful", token });
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username: user.username, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
});

app.get("/profile", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ username: decoded.username, email: decoded.email });
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
