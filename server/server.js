const express = require("express");
const { allowedHosts } = require("./constants");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();
const PORT = process.env.PORT;

const app = express();

const cors = require("cors");

app.use(express.json());
app.use(cors(allowedHosts));
app.use("/api/data", require("./routes/dataRoutes"));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server launched on http://localhost:${PORT}`);
});
