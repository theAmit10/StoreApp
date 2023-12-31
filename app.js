import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import user from "./routes/user.js";
import product from "./routes/product.js";
import order from "./routes/order.js";
import { errorMiddleware } from "./middleware/error.js";
import cors from "cors"

config({
  path: "./data/config.env",
});

export const app = express();

// Using middleware to send data to the server
app.use(express.json());
// for authentication
app.use(cookieParser());

app.use(cors({
  credentials: true,
  methods: ["GET","POST","PUT","DELETE"],
  origin: [process.env.FRONTEND_URI_1,process.env.FRONTEND_URI_2]
}))

app.get("/", (req, res, next) => {
  res.send("Working...");
});

app.use("/api/v1/user", user);
app.use("/api/v1/product", product);
app.use("/api/v1/order", order);
 
// using Error Middleware
app.use(errorMiddleware);
