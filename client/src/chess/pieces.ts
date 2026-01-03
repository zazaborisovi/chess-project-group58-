import type { Piece } from "../types/chess.types";

// importing white piece images
import whitePawnImg from "./PieceImages/white-pawn.png";
import whiteKingImg from "./PieceImages/white-king.png";
import whiteQueenImg from "./PieceImages/white-queen.png";
import whiteRookImg from "./PieceImages/white-rook.png";
import whiteBishopImg from "./PieceImages/white-bishop.png";
import whiteKnightImg from "./PieceImages/white-knight.png";

// importing black piece images
import blackPawnImg from "./PieceImages/black-pawn.png";
import blackKingImg from "./PieceImages/black-king.png";
import blackQueenImg from "./PieceImages/black-queen.png";
import blackRookImg from "./PieceImages/black-rook.png";
import blackBishopImg from "./PieceImages/black-bishop.png";
import blackKnightImg from "./PieceImages/black-knight.png";


// creating white pieces
export const whitePawn: Piece = {
  type: "pawn",
  color: "white",
  symbol: "P",
  image: whitePawnImg,
  hasMoved: false,
  enPassantable: false
}

export const whiteKing: Piece = {
  type: "king",
  color: "white",
  symbol: "K",
  image: whiteKingImg,
  hasMoved: false,
  canCastle: true
}

export const whiteQueen: Piece = {
  type: "queen",
  color: "white",
  symbol: "Q",
  image: whiteQueenImg,
  hasMoved: false
}

export const whiteRook: Piece = {
  type: "rook",
  color: "white",
  symbol: "R",
  image: whiteRookImg,
  hasMoved: false
}

export const whiteBishop: Piece = {
  type: "bishop",
  color: "white",
  symbol: "B",
  image: whiteBishopImg,
  hasMoved: false
}

export const whiteKnight: Piece = {
  type: "knight",
  color: "white",
  symbol: "N",
  image: whiteKnightImg,
  hasMoved: false
}

// creating black pieces
export const blackPawn: Piece = {
  type: "pawn",
  color: "black",
  symbol: "p",
  image: blackPawnImg,
  hasMoved: false,
  enPassantable: false
}

export const blackKing: Piece = {
  type: "king",
  color: "black",
  symbol: "k",
  image: blackKingImg,
  hasMoved: false,
  canCastle: true
}

export const blackQueen: Piece = {
  type: "queen",
  color: "black",
  symbol: "q",
  image: blackQueenImg,
  hasMoved: false
}

export const blackRook: Piece = {
  type: "rook",
  color: "black",
  symbol: "r",
  image: blackRookImg,
  hasMoved: false
}

export const blackBishop: Piece = {
  type: "bishop",
  color: "black",
  symbol: "b",
  image: blackBishopImg,
  hasMoved: false
}

export const blackKnight: Piece = {
  type: "knight",
  color: "black",
  symbol: "n",
  image: blackKnightImg,
  hasMoved: false
}