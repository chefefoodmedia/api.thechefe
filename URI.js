const isDevelopmentMode = process.env.MODE === "DEV";

const clientURL = isDevelopmentMode
  ? "http://localhost:3000"
  : ["https://app-thechefe.netlify.app/"];

module.exports = { clientURL };
