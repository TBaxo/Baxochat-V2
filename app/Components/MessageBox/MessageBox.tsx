import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MessageItem } from '../MessageItem/MessageItem'


interface MessageBoxProps {
    messages: string[];
}

export const MessageBox = (props: MessageBoxProps) => (
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