const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    // 2
    socket.on("playingStatus", (message) => {
        io.emit("playingStatus", message);
    });
    socket.on("durationChange", (message) => {
        io.emit("durationChange", message);
    })

});

http.listen(8080, () => console.log('listening on http://localhost:8080'));