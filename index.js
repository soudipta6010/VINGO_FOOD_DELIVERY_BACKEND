import dns from "node:dns/promises";
import express from "express";
import dotenv from "dotenv";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors";

import itemRouter from "./routes/item.routes.js";
import shopRouter from "./routes/shop.routes.js";
import orderRouter from "./routes/order.routes.js";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";

const app = express();
const server = http.createServer(app);

//initialize socket io
const io= new Server(server,{
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["POST", "GET"]
  }
});

app.set("io", io);


const port = process.env.PORT || 5000;
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);


server.listen(port, () => {
  connectDb();
  console.log(`Server started at ${port}`);
});
socketHandler(io);

