import { blackBishop, blackKing, blackKnight, blackPawn, blackQueen, blackRook, whiteBishop, whiteKing, whiteKnight, whitePawn, whiteQueen, whiteRook } from "./pieces"
import type { Board, Piece, Square } from "../types/chess.types"
import { getPieceMoves } from "./moves"

export function initBoard(): Board{
  const board: Board = []
  
  for (let row = 0; row < 8; row++){
    const boardRow: Square[] = []
    for (let col = 0; col < 8; col++){
      let piece = null
      
      if (row === 1) piece = blackPawn
      if (row === 6) piece = whitePawn
      
      if (row === 0){
        if (col === 0) piece = blackRook
        if (col === 1) piece = blackKnight
        if (col === 2) piece = blackBishop
        if (col === 3) piece = blackQueen
        if (col === 4) piece = blackKing
        if (col === 5) piece = blackBishop
        if (col === 6) piece = blackKnight
        if (col === 7) piece = blackRook
      }
      
      if (row === 7){
        if (col === 0) piece = whiteRook
        if (col === 1) piece = whiteKnight
        if (col === 2) piece = whiteBishop
        if (col === 3) piece = whiteQueen
        if (col === 4) piece = whiteKing
        if (col === 5) piece = whiteBishop
        if (col === 6) piece = whiteKnight
        if (col === 7) piece = whiteRook
      }
      
      boardRow.push({
        row,
        col,
        piece
      })
    }
    board.push(boardRow)
  }
  return board
}

function checkDetection(board:Board , piece: Piece) {
  const color = piece.color
  let kingRow;
  let kingCol;
  for (let row = 0; row < 8; row ++){
    for (let col = 0; col < 8; col++){
      const piece = board[row][col].piece
      if(piece?.type === "king" && piece.color === color){
        kingRow = row;
        kingCol = col;
      }
    }
  }
  for (let row = 0; row < 8; row ++){
    for (let col = 0; col < 8; col ++){
      const piece = board[row][col].piece
      if(piece && piece.color !== color){
        const moves = getPieceMoves(board , row , col , piece)
        if (moves.some(move => move.row === kingRow && move.col === kingCol)){
          return true
        }
      }
    }
  }
  return false
}

export function selectPiece(board: Board, row: number, col: number, turn: string, playerColor: string) {
  const piece = board[row][col].piece

  if (!piece || piece.color !== turn || piece.color !== playerColor) return {selected: null , moves: [] , moveNames: {}}
  
  const moves = getPieceMoves(board, row, col, piece)
  
  const legalMoves = moves.filter( move =>{
    const tempBoard = simulateMove(board, { from: { row, col }, to: move})
    
    return !checkDetection(tempBoard, piece)
  })
  
  const moveCoords = legalMoves.map(move => [move.row , move.col])
  const newMoveNames = {}
  
  legalMoves.forEach(move => {
    if (move.name){
      newMoveNames[`${move.row}-${move.col}`] = move.name
    }
  })
  
  return {selected: {row , col , piece} , moves: moveCoords || [] , newMoveNames}
}

export const simulateMove = (board: Board, move: {
  from: {row:number , col:number},
  to: {row:number , col:number}
}) => {
  const newBoard = board.map(row =>
    row.map(square => ({
      ... square,
      piece: square.piece ? {...square.piece} : null
    }))
  )
  
  const piece = newBoard[move.from.row][move.from.col].piece
  
  newBoard[move.to.row][move.to.col].piece = piece
  newBoard[move.from.row][move.from.col].piece = null

  return newBoard
}