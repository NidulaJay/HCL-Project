const express = require("express");
const cors = require("cors");
const app = express();
const connectdb = require("./App/config/db");
const userRoutes = require("./App/routes/userRoutes")



require('dotenv').config();

app.use(cors());

app.use(express.json());

app.use("/api/user", userRoutes);

connectdb();

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    const host = 'localhost'; 
    const port = server.address().port;
    console.log(`Server running at: http://${host}:${port}`);
  });



  


