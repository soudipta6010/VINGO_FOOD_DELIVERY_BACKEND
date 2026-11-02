import User from "./models/user.model.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("identity", async ({ userId }) => {
      try {
        // console.log("Identity received:", userId);
        if (!userId) {
          console.log("User ID not provided");
          return;
        }
        const user = await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              socketId: socket.id,
              isOnline: true,
            },
          },
          { returnDocument: "after" }
        );

        if (!user) {
          console.log("User not found:", userId);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", async () => {
      try {
        await User.findOneAndUpdate(
          { socketId: socket.id },
          {
            socketId: null,
            isOnline: false,
          }
        );
      } catch (error) {
        console.log("socket IO error", error);
      }
    });
  });
};
