declare var require: any

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import client from "socket.io-client";

const MessageItem = (props) => (
    <li>
        {props.message}
    </li>
)

const MessageBox = (props) => (
    <ul id='messages'>
        {props.messages.map((message) => {
            return (
                <MessageItem
                    message={message}
                    key={props.messages.indexOf(message)}
                />
            )
        })}
    </ul>
);

const App = () => {

    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState(utils.getUrlParameter('username'));
    const [messages, setMessages] = useState([]);
    const [chat, setChat] = useState("");

    const handleChange = (event) => {
        setChat(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        let message = {
            username: username,
            text: chat
        }

        socket.emit('chat_message', message);
        setChat("");
        return false;
    };

    useEffect(() => {
        setSocket(client(window.location.origin, { query: `username=${username}` }));
    }, []);

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.on('chat_message', (msg) => {
            let { username, text } = msg;
            let item = `${username}: ${text}`

            setMessages(msgs => msgs.concat(item));
        });

        socket.on('user_join', (msg) => {
            setMessages(msgs => msgs.concat(msg));
        });
    }, [socket]);

    return (
        <>
            <MessageBox messages={messages} />
            <form onSubmit={handleSubmit}>
                <input id="m" autoComplete="off" value={chat} onChange={handleChange} />
                <button>Send</button>
            </form>
        </>
    )
}





const utils = {
    getUrlParameter: function (sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    }
};


ReactDOM.render(<App />, document.getElementById('root'));