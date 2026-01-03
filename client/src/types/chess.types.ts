export type Color = "black" | "white"

export type Piece = {
  type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king",
  color: Color,
  symbol: string,
  image: string,
  hasMoved?: boolean,
  enPassantable?: boolean,
  canCastle?: boolean,
}

export interface Square{ // creating interface for squares
  row: number;
  col: number;
  piece: Piece | null
}

export type Board = Square[][];