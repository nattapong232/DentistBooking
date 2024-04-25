const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const dentists = require("./routes/dentists");
const auth = require("./routes/auth");
const bookings = require("./routes/bookings");
const cookieParser = require("cookie-parser");

const cors = require("cors");

const mongoSanitize = require("express-mongo-sanitize");

const helmet = require("helmet");

const { xss } = require("express-xss-sanitizer");

const rateLimit = require("express-rate-limit");

const hpp = require("hpp");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express VacQ API",
    },
    servers: [
      {
        url: "http://localhost:5001/api/v1",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();
app.use(cors());

app.use(express.json());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate Limiting
const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000, //10 mins
  max: 100,
});
app.use(limiter);

//Prevent http param pollutions
app.use(hpp());

//Enable CORS
app.use(cors());

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(cookieParser());

app.use("/api/v1/dentists", dentists);
app.use("/api/v1/auth", auth);
app.use("/api/v1/bookings", bookings);

const PORT = process.env.PORT || 5001;
const server = app.listen(
  PORT,
  console.log(
    "Server running in ",
    process.env.NODE_ENV,
    " mode on port ",
    PORT
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);

  server.close(() => process.exit(1));
});
