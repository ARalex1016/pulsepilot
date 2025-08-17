import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./Config/db.js";

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

  connectDB();
});
