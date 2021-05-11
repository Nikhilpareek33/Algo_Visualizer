import React, { useState } from 'react';

import "./Node.css"

export default function Node({isStart, isEnd ,isWall}){

    const extraClassName = isEnd ? 'node-end' 
    : isStart ? 'node-start' 
    : isWall ? 'node-wall' : '';

    return (
        <td className={`node ${extraClassName}`}>

        </td>
    )
}