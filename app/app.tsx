declare var require: any

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';
import { Message } from "../shared/Models/Message/Message";
import { User } from "../shared/Models/User/User";
import { UserLogInPayload, UserLogOutPayload } from '../shared/Payloads/UserEventPayloads';


const MessageItem = (props) => (
    <li>
        {props.message}
    </li>
);


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

const ChatBox = (props) => {
    //contains div, input and button
    const convertUsersTypingToString = (usersTyping) => {
        if (usersTyping.length <= 0) return "";

        if (usersTyping.length === 1) return `${usersTyping[0]} is typing...`;

        if (usersTyping.length === 3) return `Several users are typing...`

        return `${usersTyping.join(' and ')} are typing...`
    };

    return (
        <div id='chat'>
            <form id='chat-form' onSubmit={props.onSubmit}>
                <input id="m" autoComplete='off' value={props.value} onChange={props.onChange} />
                <button>Send</button>
            </form>
            <div>
                <span>
                    {convertUsersTypingToString(props.usersTyping)}
                </span>
            </div>
        </div>
    )
};

interface SidebarOnlineProps {
    onlineUsers: string[]
    offlineUsers: string[]
}

const SidebarOnline = (props: SidebarOnlineProps) => {
    return (
        <div id='sidebar-online'>
            <div>
                <span>Online -- {props.onlineUsers.length}</span>
            </div>
            <ul id='sidebar-list'>
                {props.onlineUsers.map((user) => {
                    return (
                        <li className='sidebar-list__item' key={user}>{user}</li>
                    )
                })}
            </ul>
            <div>
                <span>Offline -- {props.offlineUsers.length}</span>
            </div>
            <ul id='sidebar-list'>
                {props.offlineUsers.map((user) => {
                    return (
                        <li className='sidebar-list__item' key={user}>{user}</li>
                    )
                })}
            </ul>
        </div >
    )
};

const App = () => {

    const [socket, setSocket] = React.useState(null);
    const [ownUsername, setOwnUsername] = useState<string>(utils.getUrlParameter('username'));
    const [messages, setMessages] = useState<string[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([ownUsername]);
    const [offlineUsers, setOfflineUsers] = useState<string[]>([]);
    const [chat, setChat] = useState("");
    const [usersTyping, setUsersTyping] = useState([]);


    const handleChange = (event) => {
        setChat(event.target.value);

        if (!socket) return;

        socket.emit('user_typing', ownUsername);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!chat) return;

        if (chat.length >= 200) {
            alert("too many characters");
            return null;
        }

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
        setSocket(io(window.location.origin, { query: { username: `${ownUsername}` } }));
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

        socket.on('user_join', (data: UserLogInPayload) => {
            setOnlineUsers(data.onlineUsers);
            setOfflineUsers(data.offlineUsers);
            if (data.username === ownUsername) return;

            setMessages(msgs => msgs.concat(data.message));
        });

        socket.on('user_leave', (data: UserLogOutPayload) => {
            setOnlineUsers(data.onlineUsers);
            setOfflineUsers(data.offlineUsers);
            setMessages(msgs => msgs.concat(data.message));
        });

        socket.on('users_typing', (usersTyping) => {
            setUsersTyping(usersTyping);
        });

        socket.on('load_chat', (previousMessages: Message[]) => {
            let previousMessagesText = previousMessages.map(message => `${message.username}: ${message.text}`)

            setMessages(msgs => previousMessagesText.concat(msgs));
        })

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
            <SidebarOnline onlineUsers={onlineUsers} offlineUsers={offlineUsers} />
            <ChatBox
                onChange={handleChange}
                onSubmit={handleSubmit}
                value={chat}
                usersTyping={usersTyping}
            />

        </div>
    )
};

const utils = {
    getUrlParameter: function (sParam): string {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? "" : decodeURIComponent(sParameterName[1]);
            }
        }
    }
};

ReactDOM.render(<App />, document.getElementById('root'));