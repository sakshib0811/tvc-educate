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
    socket.on("join", async ({ userId }) => {
      const updatedUsers = await addUser(userId, socket.id);

      const sendConnectedUsers = () => {
        socket.emit("connectedUsers", {
          users: updatedUsers.filter((u) => u.userId !== userId),
        });
      };

      sendConnectedUsers(); // emit once immediately
      const intervalId = setInterval(sendConnectedUsers, 10000);

      socket.on("disconnect", () => {
        clearInterval(intervalId);
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
  });
};

module.exports = { socketHandlers };
