import MessagesManager from "../dao/mongomanagers/messageMongoManager.js";
const mm = new MessagesManager()

const socketChatServer = (socketServer) => {
    socketServer.on('connection', async (socket) => {
        console.log("conectado usuario con id: " + socket.id)
        socketServer.emit("chat2", await mm.getMessages());


        socket.on("mensaje", async (info) => {
            await mm.createMessage(info);
            socketServer.emit("chat", await mm.getMessages());
        })

        socket.on("nuevousuario", (usuario) => {
            socket.broadcast.emit("broadcast", usuario);
        })

        socket.on("clearchat", async () => {
            await mm.deleteAllMessages();
            socketServer.emit("chatCleared");
        });
    })

};
export default socketChatServer;