const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');

// Message service
class MessageService {
    constructor() {
        this.messages = [];
    }

    async find() {
        return this.messages;
    }

    async create(data) {
        const message = {
            id: this.messages.length,
            title: data.title,
            body: data.body,
            name: data.name,
        }

        message.time = moment().format('h:mm:ss a');

        this.messages.push(message);

        return message;
    }
}

const app = express(feathers());

app.use(express.json());

// Socket.io realtime api's

app.configure(socketio());

// Enable REST services

app.configure(express.rest());

// Services

app.use('/messages', new MessageService())
app.on('connection', conn => {
    app.channel('stream').join(conn);
});

// Publish events to stream
app.publish(data => {
    app.channel('stream')
});

const PORT = process.env.PORT || 3030;

app.listen(PORT).on('listening', () => {
    console.log(`Realtime server running on port ${PORT}`);
});

// app.service('messages').create({
//     title: 'Yo yo',
//     body: 'Wadup',
//     name: 'Vladislav'
// });