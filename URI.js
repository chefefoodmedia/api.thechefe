const isDevelopmentMode = process.env.MODE === "DEV";

const clientURL = isDevelopmentMode
  ? "http://localhost:3000"
  : ["https://api-thechefe.onrender.com"];

module.exports = { clientURL };
