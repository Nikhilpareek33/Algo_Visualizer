import React, { useState,useEffect} from 'react';
import Node from './Node'
import './PathFinding.css'

export default function PathFinding(){

// REACT STATES
const [ROW_COUNT,setRowCount] = useState(10);
const [COL_COUNT,setColCount] = useState(10);
const [Start_Node_Col,setStartCol] = useState(0);
const [Start_Node_Row,setStartRow] = useState(0);
const [End_Node_Col,setEndCol] = useState(2);
const [End_Node_Row,setEndRow] = useState(2);
const [Grid,setGrid] = useState([]);
// const [isEnd,setEnd] = useState(false);
// const [isStart,setStart] = useState(false);
// const []

// Function for getting the intial grid
const getInitialGrid = ()=>{

const n = ROW_COUNT;
const m = COL_COUNT;

let initialGrid = [];

for(let i=0;i<n ;i++)
{
    let currentRow = [];
    for(let j=0;j<m;j++)
    {
    currentRow.push(createNewNode(i,j));
    }

    initialGrid.push(currentRow);
}

return initialGrid;

}

    // Function for creating new node
const createNewNode = (row,col)=>{

return{
    row,   // this line will take row as it's key name and row value as its value
    col,
    isStart : (row === Start_Node_Row) && (col === Start_Node_Col),
    isEnd : (row === End_Node_Row) && (col === End_Node_Col),
    distance : Infinity,
    distanceToEndNode : Math.abs(End_Node_Row - row)+
                        Math.abs(End_Node_Col - col) , 
    
    isVisited : false,
    isWall : false,
    previousNode : null,
    isNode: true
}
}

// PRINT GRID

console.log(getInitialGrid());

useEffect( ()=>{

    console.log("use effect called");

    // if grid is empty then call the function
    if(Grid.length === 0){
        setGrid(getInitialGrid());
    }
    

});

const printGrid = (

    <table className='grid-container'>
        <tbody className='grid'>
        {
            Grid.map((row,rowIndex)=>{

                return(
                    <tr key ={rowIndex} >
                        
                        {
                            row.map( (node,nodeIndex)=>{
                                
                                // Destructuring the current node props
                                const {row, col ,isEnd, isStart , isWall} = node;

                                return(
                                    <Node key={nodeIndex}
                                     row = {row}
                                     col = {col}
                                     isEnd = {isEnd}
                                     isStart = {isStart}
                                     isWall = {isWall}
                                    />
                                )
                            })
                        }

                    </tr>
                )
            })
        }
        </tbody>
    </table>
       
)


return(
    <div className = "pathFindWrapper">
        <h1> This is Path finding logic</h1>
        {printGrid}
    </div>
)

}