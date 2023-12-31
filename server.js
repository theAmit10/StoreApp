import { app } from "./app.js";
import { connectCloudinary } from "./data/cloudinary.js";
import { connectDB } from "./data/database.js";
import Stripe from "stripe"

connectDB();

export const stripe = new Stripe(process.env.STRIPE_API_KEY)


connectCloudinary();

app.listen(process.env.PORT, () => {
  console.log(
    `Server listening on ${process.env.PORT}, in ${process.env.NODE_ENV} Mode`
  );
});

console.log(process.env.NODE_ENV);
