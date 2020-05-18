declare var require: any

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import client from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';


const SidebarOnline = (props) => {
    return (
        <div id='sidebar-online'>
            <div>
                <span>Users Online -- {props.users.length}</span>
            </div>
            <ul id='sidebar-list'>
                {props.users.map((user) => {
                    return (
                        <li className='sidebar-list__item' key={user}>{user}</li>
                    )
                })}
            </ul>
        </div >
    )
}

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
                    key={uuidv4()}
                />
            )
        })}
    </ul>
);

const App = () => {

    const [socket, setSocket] = useState(null);
    const [ownUsername, setOwnUsername] = useState(utils.getUrlParameter('username'));
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([ownUsername]);
    const [chat, setChat] = useState("");


    const handleChange = (event) => {
        setChat(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!chat) return;

        let message = {
            username: ownUsername,
            text: chat
        }

        socket.emit('chat_message', message);

        let { username, text } = message;
        let msg = `${username}: ${text}`

        setMessages(msgs => msgs.concat(msg));
        setChat("");
        return false;
    };

    useEffect(() => {
        setSocket(client(window.location.origin, { query: `username=${ownUsername}` }));
    }, []);

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.on('chat_message', (msg) => {
            let { username, text } = msg;
            let message = `${username}: ${text}`

            setMessages(msgs => msgs.concat(message));
        });

        socket.on('user_join', (data) => {
            setUsers(data.connectedusers);

            if (data.username === ownUsername) return;

            setMessages(msgs => msgs.concat(data.text));
        });

        socket.on('user_leave', (data) => {

            setMessages(msgs => msgs.concat(data.text));
            setUsers(data.connectedusers);
        });

        socket.on('disconnect', () => {
            alert("disconnected");
        });

    }, [socket]);

    useEffect(() => {
        let messageBox = document.querySelector('#messages');
        messageBox.scrollTop = messageBox.scrollHeight;
    }, [messages]);

    return (
        <div id='container'>
            <MessageBox messages={messages} />
            <SidebarOnline users={users} />
            <form id='chat' onSubmit={handleSubmit}>
                <input id="m" autoComplete='off' value={chat} onChange={handleChange} />
                <button>Send</button>
            </form>
        </div>
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