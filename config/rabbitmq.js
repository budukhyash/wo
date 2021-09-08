import * as amqp from 'amqp-connection-manager';
import dotenv from "dotenv";
import { createFiles } from '../app.js'

dotenv.config()
console.log(process.env.RABBITMQ_URI)
const QUEUE_NAME = 'judge'
const connection = amqp.connect([process.env.RABBITMQ_URI]);

connection.on('connect', function () {
    console.log('Connected!');
});

connection.on('disconnect', function (err) {
    console.log('Disconnected.', err);
});

const onMessage = (data) => {

    let message = JSON.parse(data.content.toString());
    console.log(message);
    createFiles(message, channelWrapper, data);
}

// Set up a channel listening for messages in the queue.
const channelWrapper = connection.createChannel({
    setup: function (channel) {
        // `channel` here is a regular amqplib `ConfirmChannel`.
        return Promise.all([
            channel.assertQueue(QUEUE_NAME, { durable: true }),
            channel.prefetch(1),
            channel.consume(QUEUE_NAME, onMessage)
        ]);
    }
});

channelWrapper.waitForConnect()
    .then(function () {
        console.log("Listening for messages");
    });