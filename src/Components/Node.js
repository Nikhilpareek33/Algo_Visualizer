import React, { useState } from 'react';

import "./Node.css"

export default function Node({
    isStart, 
    isEnd,
    isWall,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    row,
    col   }){

    const extraClassName = isEnd ? 'node-end' 
    : isStart ? 'node-start' 
    : isWall ? 'node-wall' : '';

    return (
        <td 
        id = {`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown = {()=>onMouseDown(row,col)}
        onMouseEnter = {()=>onMouseEnter(row,col)}
        onMouseUp = {()=>onMouseUp(row,col)} >
       
        </td>
    )
}