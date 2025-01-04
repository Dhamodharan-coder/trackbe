import express from "express";
import cors from "cors";
import connectDB from "./database/db.js";
import Branch from "./router/Branchrouter.js"
import auth from "./router/auth.js"
const app = express();
const PORT = 3000;


connectDB()
app.use(express.json());
app.use(cors());


app.use("/",Branch)
app.use("/",auth)

app.get("/", (req, res) => {
    res.json("API is Working");
});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});