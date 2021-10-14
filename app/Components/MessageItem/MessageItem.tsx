import React from 'react';
interface MessageItemProps {
    message: string;
}

export const MessageItem = (props: MessageItemProps) => (
    <li>
        {props.message}
    </li>
);