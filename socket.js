import User from "./models/user.model.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("identity", async ({ userId }) => {
      try {
        const user = await User.findByIdAndUpdate(
          userId,
          {
            socketId: socket.id,
            isOnline: true, //3.22min
          },
          { returnDocument: "after" }
        );
      } catch (error) {
        console.log(error);
      }
    });
  });
};
