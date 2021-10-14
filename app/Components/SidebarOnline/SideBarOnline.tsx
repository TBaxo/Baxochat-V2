import React from 'react';

interface SidebarOnlineProps {
    onlineUsers: string[]
    offlineUsers: string[]
}

export const SidebarOnline = (props: SidebarOnlineProps) => {
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