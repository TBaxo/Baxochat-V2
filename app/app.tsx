declare var require: any
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import ReactDOM from 'react-dom';

import { User } from "../shared/Models/User/User";
import { Message } from "../shared/Models/Message/Message";

import { UserLogInPayload, UserLogOutPayload } from '../shared/Payloads/UserEventPayloads';

import { MessageBox } from './Components/MessageBox/MessageBox';
import { ChatBox } from './Components/ChatBox/ChatBox';
import { SidebarOnline } from './Components/SidebarOnline/SideBarOnline';


const App = () => {

    const [socket, setSocket] = useState<Socket>(null);
    const [ownUsername, setOwnUsername] = useState<string>(utils.getUrlParameter('username'));
    const [messages, setMessages] = useState<string[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([ownUsername]);
    const [offlineUsers, setOfflineUsers] = useState<string[]>([]);
    const [chat, setChat] = useState<string>("");
    const [usersTyping, setUsersTyping] = useState([]);


    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setChat(event.target.value);

        if (!socket) return;

        socket.emit('user_typing', ownUsername);
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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