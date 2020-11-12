let io;

module.exports = {
    intit: httpServer => {
        io = require("socket.io")(httpServer);
        return io;
    },
    getIO : () => {
        if (!io) {
            throw new Error("Socket.IO not initialized");
        }
        return io;
    }
}