import { useEffect, useState } from "react";
import type { Piece } from "../types/chess.types";
import { useChess } from "../contexts/chess.context";
import { selectPiece } from "./init.board";
import { blackBishop, blackKnight, blackQueen, blackRook, whiteBishop, whiteKnight, whiteQueen, whiteRook } from "./pieces";
import { isInCheckmate, isInStalemate } from "./game.logic";
import { useAuth } from "../contexts/auth.context";
import { useForm } from "../hooks/useForm";

export default function BoardComponent(){
  const {user} = useAuth()
  const {
    socket,
    setGameId,
    setPlayerColor,
    gameId,
    board,
    setBoard,
    updateBoardForEveryone,
    turn,
    setTurn,
    playerColor,
    stalemate,
    setStalemate,
    checkmate,
    setCheckmate,
  } = useChess()
  const [loading , setLoading] = useState(true)
  const [opponent , setOpponent] = useState(null)
  
  useEffect(() =>{
    const path = window.location.pathname
    const newGameId = path.split("/")[2]
    
    socket.emit("join-game-room" , {gameId: newGameId , user: user.username})
    socket.on("player-joined" , ({playerColor , opponent}) =>{
      setPlayerColor(playerColor)
      setOpponent(opponent)
    })
    socket.on("data" , ({board , turn}) =>{
      setGameId(newGameId)
      setBoard(board)
      setTurn(turn)
    })
    
    setLoading(false)
    
    return () =>{
      socket.off("player-joined")
      socket.off("data")
    }
  }, [])
  
  const [moveNames , setMoveNames] = useState({}) //for special moves
  const [selectedPiece , setSelectedPiece] = useState(null)
  const [highlightedSquares, setHighlightedSquares] = useState([])
  const [promotionData , setPromotionData] = useState(null)
  
  const promotion = () => {
    if(!promotionData) return null
    
    const {from , to} = promotionData
    const color = from.piece.color
    const nextTurn = turn === "white" ? "black" : "white"
    
    const handlePromotion = (chosenPiece: Piece) =>{
      const promotedPiece = {...chosenPiece, hasMoved: true}
      
      setBoard(prev => {
        const newBoard = [...prev]
        
        newBoard[to.row][to.col].piece = promotedPiece
        newBoard[from.row][from.col].piece = null
        
        const opponentIsInCheckmate = isInCheckmate(newBoard, nextTurn)
        const opponentIsInStalemate = isInStalemate(newBoard, nextTurn)
        
        setStalemate(opponentIsInStalemate)
        setCheckmate(opponentIsInCheckmate)
        
        updateBoardForEveryone(newBoard, nextTurn, {
          stalemate: opponentIsInStalemate,
          checkmate: opponentIsInCheckmate
        })
        
        return newBoard
      })
      setPromotionData(null)
      setSelectedPiece(null)
      setHighlightedSquares([])
      setMoveNames({})
      setTurn(nextTurn)
    }
    const promotionOptions = color === "white" ? [
      {piece: whiteQueen , text: "Queen"}, {piece: whiteRook , text: "Rook"}, {piece: whiteBishop , text: "Bishop"}, {piece: whiteKnight , text: "Knight"}
    ] : [
      {piece: blackQueen , text: "Queen"}, {piece: blackRook , text: "Rook"}, {piece: blackBishop , text: "Bishop"}, {piece: blackKnight , text: "Knight"}
    ]
    return(
      <>
        {promotionOptions.map(({piece, text} , index) => (
          <button key={index} onClick={() => handlePromotion(piece)}>
            {text}
          </button>
        ))}
      </>
    )
  }
  
  const handleClick = (row: number, col: number) => {
    if (isHighlighted(row, col) && selectedPiece) { // this is what handles the move(after we click on the piece it highlights possible move squares and when we click on the move square it moves there using this block of code)
      const updatedPiece = { ...selectedPiece.piece, hasMoved: true }
      const nextTurn = turn === "white" ? "black" : "white"
      const currentSpecialMove = moveNames[`${row}-${col}`] // for special moves like enPassant or castling
      
      // promotion block
      if(currentSpecialMove === "promotion"){
        setPromotionData({
          from: selectedPiece,
          to: { row, col }
        })
        return
      }
      
      setBoard(prev =>{
        const newBoard = [...prev]
        
        // enpasant block
        if (currentSpecialMove == "twoSteps"){ // makes the piece enPassantable after it moves two steps
          updatedPiece.enPassantable = true
        }
        if (currentSpecialMove === "enPassantLeft"){ // removes the piece that was enPassantable
          newBoard[selectedPiece.row][selectedPiece.col - 1].piece = null
        }
        if (currentSpecialMove === "enPassantRight"){
          newBoard[selectedPiece.row][selectedPiece.col + 1].piece = null
        }
        //
        
        // castling block
        if(currentSpecialMove === "queenSideCastle"){
          newBoard[selectedPiece.row][selectedPiece.col - 4].piece = null
          newBoard[selectedPiece.row][selectedPiece.col - 1].piece = updatedPiece.color == "white" ? {...whiteRook, hasMoved: true, canCastle: false} : {...blackRook, hasMoved: true, canCastle: false}
        }
        if(currentSpecialMove === "kingSideCastle"){
          newBoard[selectedPiece.row][selectedPiece.col + 3].piece = null
          newBoard[selectedPiece.row][selectedPiece.col + 1].piece = updatedPiece.color == "white" ? {...whiteRook, hasMoved: true, canCastle: false} : {...blackRook, hasMoved: true, canCastle: false}
        }

        
        newBoard[row][col].piece = updatedPiece
        newBoard[selectedPiece.row][selectedPiece.col].piece = null
        
        const opponentIsInCheckmate = isInCheckmate(newBoard , nextTurn)
        const opponentIsInStalemate = isInStalemate(newBoard , nextTurn)        
        
        setStalemate(opponentIsInStalemate)
        setCheckmate(opponentIsInCheckmate)
        
        updateBoardForEveryone(newBoard , nextTurn , {
          stalemate: opponentIsInStalemate,
          checkmate: opponentIsInCheckmate
        })
        
        return newBoard
      })
      // resets everything
      setSelectedPiece(null)
      setHighlightedSquares([])
      setMoveNames({})
      setTurn(nextTurn)
      return
    }
    
    const {selected , moves , newMoveNames} = selectPiece(board , row , col , turn , playerColor)
    setSelectedPiece(selected)
    setHighlightedSquares(moves)
    setMoveNames(newMoveNames)
  }
  
  const isHighlighted = (row: number, col: number) => {
    return highlightedSquares.some(square => square[0] === row && square[1] === col) // to highlight possible moves for piece when selected
  }
  
  return(
    <>
      {gameId}
      {loading ? <div className="bg-green-600 w-fit flex items-center rounded-lg border-2"><div className="animate-spin size-5 rounded-full border-2 border-gray-500 border-t-white" />Loading...</div> : (
      <>
        <div className="mb-2 text-sm">
          Playing as: <strong className="capitalize">{playerColor}</strong> | 
          Turn: <strong className="capitalize">{turn}</strong>
          {checkmate && <div className="capitalize">{playerColor != turn ? user.username : opponent} won the game</div>}
          {stalemate && <div>Stalemate</div>}
        </div>
        <div className={`w-fit h-fit flex ${playerColor === 'black' ? 'flex-col-reverse' : 'flex-col'}`}>
          {promotionData && 
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                {promotion()}
              </div>
            </div>
          }
          {board?.map((row , rowIndex) =>(
            <div key={rowIndex} className={`flex ${playerColor === 'black' ? 'flex-row-reverse' : 'flex-row'}`}>
              {row.map((square , colIndex) => {
                const isDark = (rowIndex + colIndex) % 2 === 1
                    
                return(
                  <button onClick={(e) => handleClick(rowIndex, colIndex)} className={`flex items-center justify-center ${isHighlighted(rowIndex, colIndex) ? "bg-blue-800" : isDark ? 'bg-amber-800 text-white' : 'bg-gray-200 text-black'} w-10 h-10`} key={colIndex}>
                    {square?.piece ? (
                      <>
                        <img src={square.piece.image} alt={square.piece.type}/>
                      </>
                    ) : (
                      <p className="text-black/0 w-[80%] h-[80%]">.</p>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </>
      )}
    </>
  )
}