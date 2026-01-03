import type { Board, Piece } from "../types/chess.types";

export function isInBoard(row: number, col: number){
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}
const checkTeamPiece = (board: Board , row: number , col:number , piece: Piece) =>{ // checks if the square has a friendly piece on it
  return board[row]?.[col]?.piece && board[row][col].piece.color == piece.color // returns true if the square has a friendly piece on it
}

function getPawnMoves(board: Board, fromRow: number, fromCol: number, piece: Piece) {
  const direction = piece.color === "white" ? -1 : 1;
  const moves = []

  const oneStep = fromRow + direction // creating oneStep variable for pawns one square forward move
  if (isInBoard(oneStep, fromCol) && !board[oneStep][fromCol].piece) { // checks if the square in front of the pawn is empty(row square) and adds it to moves if it is
    moves.push({ row: oneStep, col: fromCol })
    
    if (!piece.hasMoved) { // if pawn has not moved yet it can move two squares forward
      const twoSteps = fromRow + direction * 2
      if (isInBoard(twoSteps, fromCol) && !board[twoSteps][fromCol].piece) { // if next 2 squares are empty only then we can add two squares forward move in array
        moves.push({ row: twoSteps, col: fromCol , name:"twoSteps"})
      }
    }
  }
  const left = fromCol - 1
  const right = fromCol + 1
  if(isInBoard(fromRow , left)){
    const leftPiece = board[fromRow][left].piece
    if (leftPiece && leftPiece.type == "pawn" && !checkTeamPiece(board , fromRow , left , piece) && leftPiece.enPassantable){
      moves.push({ row: oneStep, col: left , name:"enPassantLeft"})
    }
  }
  if (isInBoard(fromRow , right)){
    const rightPiece = board[fromRow][right].piece
    if (rightPiece && rightPiece.type == "pawn" && !checkTeamPiece(board , fromRow , right , piece) && rightPiece.enPassantable){
      moves.push({ row: oneStep, col: right , name:"enPassantRight"})
    }
  }
  
  const attacks = [
    { row: oneStep, col: fromCol + 1 },
    { row: oneStep, col: fromCol - 1 }
  ]
  
  attacks.forEach(({ row, col }) =>{ // checks if the square is in board and if there is an enemy piece on that square    
    if (isInBoard(row , col) && board[row][col].piece && board[row][col].piece.color !== piece.color){
      const promotion = (piece.color == "white" && oneStep == 0) || (piece.color == "black" && oneStep == 7)
      if (promotion){
        moves.push({ row: oneStep, col: fromCol , name:"promotion"})
      }else{
        moves.push({ row, col })
      }
    }
  })
  
  return moves
}
function getKingMoves(board: Board, fromRow: number, fromCol: number, piece: Piece){
  const moves = []
  // [-1 , -1] [-1 , 0] [-1 , 1]
  // [0 , -1]  [0 , 0]  [0 , 1] <-- skips the [0 , 0] because its in the center meaning its current position(coordinates)
  // [1 , -1]  [1 , 0]  [1 , 1]
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++){
      if(!(i === 0 && j === 0) && !checkTeamPiece(board, fromRow + i, fromCol + j, piece) && isInBoard(fromRow + i, fromCol + j)){
        moves.push({row:fromRow + i , col: fromCol + j})
      }
    }
  }
  
  // handling castling
  if(!piece.hasMoved){
    const kingSideClear = !board[fromRow][5].piece && !board[fromRow][6].piece
    const queenSideClear = !board[fromRow][1].piece && !board[fromRow][2].piece && !board[fromRow][3].piece
    
    const kingSideRook = board[fromRow][7].piece
    const queenSideRook = board[fromRow][0].piece
    
    if(kingSideClear && kingSideRook && kingSideRook.type === "rook" && !kingSideRook.hasMoved){
      moves.push({row:fromRow , col: fromCol + 2 , name: "kingSideCastle"})
    }
    
    if(queenSideClear && queenSideRook && queenSideRook.type === "rook" && !queenSideRook.hasMoved){
      moves.push({row:fromRow , col: fromCol - 2 , name: "queenSideCastle"})
    }
  }
  
  return moves
}
function getRookMoves(board: Board, fromRow: number, fromCol: number, piece: Piece) {
  const moves = []
  for (let i = fromCol - 1; i >= 0; i--) { // creating loop to push all the possible moves in moves array in this case going towards left side of array
    if (isInBoard(fromRow, i)){
      if (checkTeamPiece(board, fromRow, i, piece)) break
      
      moves.push({row:fromRow , col: i})
      
      if(board[fromRow][i].piece) break
    }
  }
  for (let i = fromCol + 1; i < 8; i++) { // right side of array
    if (isInBoard(fromRow, i)){
      if (checkTeamPiece(board, fromRow, i, piece)) break
      
      moves.push({row:fromRow , col: i})
      
      if(board[fromRow][i].piece) break
    }
  }
  for (let i = fromRow - 1; i >= 0; i--) { // top side of array
    if (isInBoard(i, fromCol)){
      if (checkTeamPiece(board, i, fromCol, piece)) break
      
      moves.push({row:i , col: fromCol})
      
      if(board[i][fromCol].piece) break
    }
  }
  for (let i = fromRow + 1; i < 8; i++) { // bottom side of array
    if (isInBoard(i, fromCol)){
      if (checkTeamPiece(board, i, fromCol, piece)) break
      
      moves.push({row:i , col: fromCol})
      
      if(board[i][fromCol].piece) break
    }
  }
  return moves
}
function getBishopMoves(board: Board, fromRow: number, fromCol: number, piece: Piece){
  const moves = []
  for (let i = fromRow - 1, j = fromCol - 1; i >= 0 && j >= 0; i--, j--){ // diagonal leading top left
    if(isInBoard(i, j)){
      if(checkTeamPiece(board, i, j, piece)) break
      
      moves.push({row:i , col: j})
      
      if(board[i][j].piece) break
    }
  }
  for (let i = fromRow - 1, j = fromCol + 1; i >= 0 && j < 8; i--, j++){ // diagonal leading top right
    if(isInBoard(i, j)){
      if(checkTeamPiece(board, i, j, piece)) break
      
      moves.push({row:i , col: j})
      
      if(board[i][j].piece) break
    }
  }
  for (let i = fromRow + 1, j = fromCol + 1; i < 8 && j < 8; i++, j++){ // diagonal leading bottom right
    if(isInBoard(i, j)){
      if(checkTeamPiece(board, i, j, piece)) break
      
      moves.push({row:i , col: j})
      
      if(board[i][j].piece) break
    }
  }
  for (let i = fromRow + 1, j = fromCol - 1; i < 8 && j >= 0; i++, j--){ // diagonal leading bottom left
    if(isInBoard(i, j)){
      if(checkTeamPiece(board, i, j, piece)) break
      
      moves.push({row:i , col: j})
      
      if(board[i][j].piece) break
    }
  }
  return moves
}
function getKnightMoves(board: Board, fromRow: number, fromCol: number, piece: Piece) {
  const moves = [];
  const knightMoves = [
    [-2, -1], [-2, 1],
    [-1, -2], [-1, 2],
    [1, -2], [1, 2],
    [2, -1], [2, 1]
  ];
  
  for (const [rowOffset, colOffset] of knightMoves) {
    const newRow = fromRow + rowOffset;
    const newCol = fromCol + colOffset;
    
    if (isInBoard(newRow, newCol) && !checkTeamPiece(board, newRow, newCol, piece)) {
      moves.push({ row: newRow, col: newCol });
    }
  }
  
  return moves;
}
function getQueenMoves(board: Board, fromRow: number, fromCol: number, piece: Piece) {
  const moves = [];
  
  // Add moves from rook and bishop functions
  moves.push(...getRookMoves(board, fromRow, fromCol, piece));
  moves.push(...getBishopMoves(board, fromRow, fromCol, piece));
  
  return moves;
}

export function getPieceMoves(board:Board , fromRow: number , fromCol: number, piece: Piece){
  if(piece.type === "pawn"){
    return getPawnMoves(board , fromRow , fromCol , piece)
  }
  if(piece.type === "knight"){
    return getKnightMoves(board , fromRow , fromCol , piece)
  }
  if(piece.type === "bishop"){
    return getBishopMoves(board , fromRow , fromCol , piece)
  }
  if(piece.type === "rook"){
    return getRookMoves(board , fromRow , fromCol , piece)
  }
  if(piece.type === "queen"){
    return getQueenMoves(board , fromRow , fromCol , piece)
  }
  if(piece.type === "king"){
    return getKingMoves(board , fromRow , fromCol , piece)
  }
}