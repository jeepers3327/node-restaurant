import express from "express";

import cors from "cors";

const app = express();
const port = 80; // default port to listen

// here we are adding middleware to parse all incoming requests as JSON
app.use(express.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());

// define a route handler for the default home page
app.get("/health", (req, res) => {
  res.send("OK");
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
