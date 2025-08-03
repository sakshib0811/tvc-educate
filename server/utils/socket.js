let users = [];

const addUser = async (userId, socketId) => {
  const existingUser = users.find((u) => u.userId === userId);

  if (existingUser) {
    if (existingUser.socketId === socketId) return users;
    await removeUser(existingUser.socketId);
  }

  users.push({ userId, socketId });
  return users;
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const findConnectedUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const emitNotification = (io, receiverId, payload) => {
  const receiverSocket = findConnectedUser(receiverId);
  if (receiverSocket) {
    io.to(receiverSocket.socketId).emit("notificationReceived", payload);
  }
};

const socketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    socket.on("join", async ({ userId }) => {
      const updatedUsers = await addUser(userId, socket.id);
      console.log(`User ${userId} joined with socket ${socket.id}`);

      // Send initial connected users list
      socket.emit("connectedUsers", {
        users: updatedUsers.filter((u) => u.userId !== userId),
      });

      // Only send periodic updates if there are other users and reduce frequency
      let intervalId = null;
      if (updatedUsers.length > 1) {
        intervalId = setInterval(() => {
          const currentUsers = users.filter((u) => u.userId !== userId);
          if (currentUsers.length > 0) {
            socket.emit("connectedUsers", { users: currentUsers });
          } else {
            // Clear interval if no other users
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
          }
        }, 300000); // Increased to 5 minutes (300 seconds)
      }

      // Store interval ID on socket for cleanup
      socket.intervalId = intervalId;

      socket.on("disconnect", () => {
        console.log(`User ${userId} disconnected: ${socket.id}`);
        if (socket.intervalId) {
          clearInterval(socket.intervalId);
        }
        removeUser(socket.id);
      });
    });

    socket.on("like", ({ postId, sender, receiver, like }) => {
      if (sender && receiver?.id !== sender.userId && like) {
        emitNotification(io, receiver.id, {
          postId,
          senderName: sender.name,
          receiverName: receiver.name,
          senderImage: sender.avatar,
        });
      }
    });

    socket.on("comment", ({ postId, sender, receiver }) => {
      if (sender && receiver?.id !== sender.userId) {
        emitNotification(io, receiver.id, {
          postId,
          senderName: sender.name,
          receiverName: receiver.name,
          receiverId: receiver.id,
          senderImage: sender.avatar,
          date: new Date().toISOString(),
        });
      }
    });

    socket.on("follow", ({ sender, receiver }) => {
      if (sender && receiver?.id !== sender.userId) {
        emitNotification(io, receiver.id, {
          senderName: sender.name,
          receiverName: receiver.name,
          receiverId: receiver.id,
          senderImage: sender.avatar,
          date: new Date().toISOString(),
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      if (socket.intervalId) {
        clearInterval(socket.intervalId);
      }
      removeUser(socket.id);
    });
  });
};

module.exports = { socketHandlers };
