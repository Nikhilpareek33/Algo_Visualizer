import React, { useState,useEffect} from 'react';
import Node from './Node';
import './PathFinding.css';
import {bfs} from '../Algo/BFS'

export default function PathFinding(){

// REACT STATES
const [ROW_COUNT,setRowCount] = useState(10);
const [COL_COUNT,setColCount] = useState(10);
const [Start_Node_Col,setStartCol] = useState(0);
const [Start_Node_Row,setStartRow] = useState(0);
const [End_Node_Col,setEndCol] = useState(2);
const [End_Node_Row,setEndRow] = useState(2);
const [Grid,setGrid] = useState([]);
const [isEndNode,setEndNode] = useState(false);
const [isStartNode,setStartNode] = useState(false);
const [isRunning, setisRunning] = useState(false);
const [mouseIsPressed, setMousePressed] = useState(false);
const [curRow,setCurRow] = useState(0);
const [curCol,setCurCol] = useState(0);
const [isWallNode,setWallNode] = useState(false);


// MOUSE EVENT HANDLERS ////////////////////////////////////////////////////////////////////////////////////

// 1 Down

const handleMouseDown = (row,col)=>{
    console.log("mouse DOWN called");

    // not running
    if(!isRunning){

        if(isGridClear()){
            if(
                document.getElementById(`node-${row}-${col}`).className ===
                      'node node-start'
            ){
                setMousePressed(true);
                setStartNode(true);
                setCurCol(row);
                setCurCol(col);
            }else if(
                document.getElementById(`node-${row}-${col}`).className ===
                      'node node-end'
            ){
                setMousePressed(true);
                setEndNode(true);
                setCurRow(row);
                setCurCol(col);

            }else{

                const newGrid = getNewGridWithWallToggled(Grid,row,col);

                setGrid(newGrid);
                setMousePressed(true);
                setCurRow(row);
                setCurCol(col);
                setWallNode(true);
            }
        }
    }
}


// 2 ENTER
const handleMouseEnter =(row,col)=>{

    console.log("mouse ENTER called");

    // not running 
    if(!isRunning){

        // mouse is already pressed
        if(mouseIsPressed){
            const nodeClassName = document.getElementById(`node-${row}-${col}`
            ).className;

            if(isStartNode){
                if(nodeClassName !== 'node node-wall'){
                    const prevStartNode = Grid[curRow][curCol];

                    prevStartNode.isStart =false;

                    document.getElementById(
                        `node-${curRow}-${curCol}`,
                      ).className = 'node';

                      setCurRow(row);
                      setCurCol(col);
      
                      const currStartNode = Grid[row][col];
      
                      currStartNode.isStart = true;
      
                      document.getElementById(`node-${row}-${col}`).className = 
                      'node node-start';
                }

                setStartRow(row);
                setStartCol(col);
    
            
            }else if( isEndNode){

                if(nodeClassName !== 'node node-wall'){

                    const prevEndNode = Grid[curRow][curCol];

                    prevEndNode.isEnd =false;

                    document.getElementById(
                        `node-${curRow}-${curCol}`,
                      ).className = 'node';

                      setCurRow(row);
                      setCurCol(col);
      
                      const currEndNode = Grid[row][col];
      
                      currEndNode.isEnd = true;
      
                      document.getElementById(`node-${row}-${col}`).className = 
                      'node node-end';
                }

                setEndRow(row);
                setEndCol(col);
            }
            
          
        }
    }
}

// 3 UP
const handleMouseup = (row,col)=>{

    console.log("mouse up called");

    if(!isRunning){
        setMousePressed(false);

        if(isStartNode){
            const isStartNode2 = !isStartNode;

            setStartNode(isStartNode2);
            setStartRow(row);
            setStartCol(col);
        } else if(isEndNode){
            const isEndNode2 = !isEndNode;
    
            setEndNode(isEndNode2);
            setEndRow(row);
            setEndCol(col);
        }
    
        getInitialGrid();
    } 

}

// 4 LEAVE
const handleMouseLeave = ()=> {

    console.log("mouse leave called");

    if (isStartNode) {
      const isStartNode2 = !isStartNode;
      setStartNode(isStartNode2);
      setMousePressed(false);

      
    } else if (isEndNode) {
      const isEndNode2 = !isEndNode;
      setEndNode(isEndNode2);
      setMousePressed(false);
    } else if (isWallNode) {
      const isWallNode2 = isWallNode;
      setWallNode(isWallNode2);
      setMousePressed(false);
      getInitialGrid();
    }
  }

////////////////////////////////////////////////////////////////////// GRID MANIPULATION FUNCTIONALITY ////////////////////////////////////////////

// NEW GRID WALLS TOGGLED //////////////////////////////////////////////////////////////////

const getNewGridWithWallToggled = (grid, row, col) => {
    // mouseDown starts to act strange if I don't make newGrid and work off of grid instead.
    const newGrid = grid.slice();

    const node = newGrid[row][col];

    if (!node.isStart && !node.isFinish && node.isNode) {
      const newNode = {
        ...node,
        isWall: !node.isWall,
      };

      newGrid[row][col] = newNode;
    }
    return newGrid;
  };


// CLEAR GRID  /////////////////////////////////////////////////////////////////////////////////////
const isGridClear = ()=>{

    for(let row of Grid)
    {
        for(let node of row)
        {
            const nodeClassName = document.getElementById(
                `node-${node.row}-${node.col}`,
            ).className;

            if(
                nodeClassName === 'node node-visited' ||
                nodeClassName === 'node node-shortest-path'
            ){
                return false;
            }
        }
    }

    return true;
}

// CLEAR WALLS //////////////////////////////////////////////////////////////////////////////////////////

const clearWalls = ()=>{

    if(!isRunning){
        const newGrid = Grid.slice();

        for(let row of newGrid){
            for(let node of row){
                
                let nodeClassName = document.getElementById(
                    `node-${node.row}-${node.col}`,
                ).className;

                if(nodeClassName === 'node node-wall'){
                    document.getElementById(`node-${node.row}`).className = 'node';
                    node.isWall = false;
                }

            }
        }
    }
}

// CLEAR GRID //////////////////////////////////////////////////////////////////////////////////

const clearGrid = ()=>{
    if(!isRunning){
        const newGrid = Grid.slice();

        for(let row of newGrid){
            for(let node of row){

                let nodeClassName = document.getElementById(
                    `node-${node.row}-${node.col}`,
                ).className;

                if (
                    nodeClassName !== 'node node-start' &&
                    nodeClassName !== 'node node-finish' &&
                    nodeClassName !== 'node node-wall'
                  ) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                      'node';
                    node.isVisited = false;
                    node.distance = Infinity;
                    node.distanceToEndNode =
                      Math.abs(End_Node_Row - node.row) +
                      Math.abs(End_Node_Col - node.col);
                  }
                  if (nodeClassName === 'node node-finish') {
                    node.isVisited = false;
                    node.distance = Infinity;
                    node.distanceToEndNode = 0;
                  }
                  if (nodeClassName === 'node node-start') {
                    node.isVisited = false;
                    node.distance = Infinity;
                    node.distanceToFinishNode =
                      Math.abs(End_Node_Row - node.row) +
                      Math.abs(End_Node_Col - node.col);
                    node.isStart = true;
                    node.isWall = false;
                    node.previousNode = null;
                    node.isNode = true;
                  }

            }
        }
    }
}

/////////////////////////////////////////////////////// VISUALIZE AND ANIMATION   /////////////////////////////////////////////////////////////////

const visualize = (algo)=>{

    if (!isRunning) {
      clearGrid();

      let temp = !isRunning;
      setisRunning(temp);

      const startNode =
        Grid[Start_Node_Row][Start_Node_Col];
      const finishNode =
        Grid[End_Node_Row][End_Node_Col];
      
    let visitedNodesInOrder;

      console.log("in visualize" + algo);

    switch (algo) {
        case 'Dijkstra':
        //   visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
          break;
        case 'AStar':
        //   visitedNodesInOrder = AStar(grid, startNode, finishNode);
          break;
        case 'BFS':
          visitedNodesInOrder = bfs(Grid, startNode, finishNode);
          break;
        case 'DFS':
        //   visitedNodesInOrder = dfs(grid, startNode, finishNode);
          break;
        default:
          // should never get here
          break;
      }

      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      nodesInShortestPathOrder.push('end');
      animate(visitedNodesInOrder, nodesInShortestPathOrder);
    }
  }

const  animate =  (visitedNodesInOrder, nodesInShortestPathOrder) => {

    console.log("animate called");
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
        animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const nodeClassName = document.getElementById(
          `node-${node.row}-${node.col}`,
        ).className;
        if (
          nodeClassName !== 'node node-start' &&
          nodeClassName !== 'node node-end'
        ) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-visited';
        }
      }, 10 * i);
    }
  }

const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      if (nodesInShortestPathOrder[i] === 'end') {
        setTimeout(() => {
          let temp = !isRunning;
          setisRunning(temp);
        }, i * 50);
      } else {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          const nodeClassName = document.getElementById(
            `node-${node.row}-${node.col}`,
          ).className;
          if (
            nodeClassName !== 'node node-start' &&
            nodeClassName !== 'node node-end'
          ) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-shortest-path';
          }
        }, i * 40);
      }
    }
  }

// Backtracks from the finishNode to find the shortest path.
// Only works when called after the pathfinding methods.
function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }

//////////////////////////////////////////////////// Function for getting the intial grid /////////////////////////////////////////////////////////////


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

// Function for creating new node ///////////////////////////////////////

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

console.log(getInitialGrid());

useEffect( ()=>{

    console.log("use effect called");

    // if grid is empty then call the function
    if(Grid.length === 0){
        setGrid(getInitialGrid());
    }
    

});
const handleSubmit = ()=>{
    console.log('handle submit is called');
    visualize('BFS');
}

// PRINT GRID ////////////////////////////////////////////////////////////////
const printGrid = (

    <table className='grid-container'
    onMouseLeave={() => handleMouseLeave()}
    >
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
                                     mouseIsPressed={mouseIsPressed}
                                    onMouseDown={(row,col)=>handleMouseDown(row, col)}
                                    onMouseUp = {(row,col)=>handleMouseup(row,col)}    
                                    onMouseEnter = {(row,col)=> handleMouseEnter(row, col)}
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
        <button onClick={handleSubmit}>BFS</button>
    </div>
)

}

