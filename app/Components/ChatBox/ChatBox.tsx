import React, { ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler } from "react";


interface ChatBoxFunctions {
    onChange: ChangeEventHandler;
    onSubmit: FormEventHandler;
}

interface ChatBoxProps extends ChatBoxFunctions {
    value: string;
    usersTyping: string[];
}

export const ChatBox = (props: ChatBoxProps) => {
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