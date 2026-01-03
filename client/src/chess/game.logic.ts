// checking for check , checkmate , stalemate so we dont allow illegal moves

import { simulateMove } from "./init.board";
import { getPieceMoves } from "./moves";
import type { Board, Color } from "../types/chess.types";

export function findKing(board: Board, color: Color){
  for (let row = 0; row < 8; row ++) {
    for (let col = 0; col < 8; col ++) {
      const piece = board[row][col].piece
      if (piece && piece.type === "king" && piece.color === color) {
        return { row, col }
      }
    }
  }
  return null
}

export function isSquareAttacked(board: Board , row: number , col:number , color: Color){
  for (let loopRow = 0; loopRow < 8; loopRow ++){
    for (let loopCol = 0; loopCol < 8; loopCol ++){
      const piece = board[loopRow][loopCol].piece
      if(piece && piece.color !== color){
        const moves = getPieceMoves(board , loopRow , loopCol , piece)
        if(moves.some(move => move.row === row && move.col === col)){
          return true
        }
      }
    }
  }
  return false
}

export function isInCheck(board: Board , color: Color){
  const king = findKing(board , color)
  if(!king) return false
  
  return isSquareAttacked(board , king.row , king.col , color)
}

export function hasLegalMoves(board: Board , color: Color){
  for (let row = 0; row < 8; row ++){
    for (let col = 0; col < 8; col++){
      const piece = board[row][col].piece
      if(piece && piece.color === color){
        const moves = getPieceMoves(board , row , col , piece)
        
        for(const move of moves){
          const tempBoard = simulateMove(board , {from: {row , col} , to: move})
          
          if(!isInCheck(tempBoard , color)){
            return true
          }
        }
      }
    }
  }
  return false
}

export function isInCheckmate(board: Board, color: Color) {
  return isInCheck(board, color) && !hasLegalMoves(board, color)
}

export function isInStalemate(board: Board , color: Color){
  return !isInCheck(board , color) && !hasLegalMoves(board , color)
}