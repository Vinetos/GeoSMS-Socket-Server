const server = require('http').createServer();
const io = require('socket.io')(server, {
    serveClient: false,
    wsEngine: 'ws' // uws is not supported since it is a native module
});
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

// When user wants to connect
io.on('connect', (socket) => {
    console.log('connect ' + socket.id)
    // Client wants to disconnect
    socket.on('disconnect', () => console.log('disconnect ' + socket.id));

    // Operator send the sms and wait for client location
    socket.on('register', (patientId) => {
        socket.join(patientId)
    });

    // A patient send its position
    socket.on('send', (patientId, position) => {
        // Send the position to the operator's room
        io.to(patientId).emit('update', position)
    })
});
