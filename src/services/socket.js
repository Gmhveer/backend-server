
const fs = require('fs');


module.exports = initSocket = () => {
    const { Io } = global;
    //Create Socket Connection
    Io.on('connection', (client) => {
        console.log('connection establish', client.id);
        client.on('GET_QR', () => {
            console.log('[ Now Whats app Client Initiate ]');
        });
    });
}

