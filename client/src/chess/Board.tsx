import { useEffect, useState } from "react";
import type { Piece } from "../types/chess.types";
import { useChess } from "../contexts/chess.context";
import { selectPiece } from "./init.board";
import { blackBishop, blackKnight, blackQueen, blackRook, whiteBishop, whiteKnight, whiteQueen, whiteRook } from "./pieces";
import { isInCheckmate, isInStalemate, isSquareAttacked } from "./game.logic";
import { useAuth } from "../contexts/auth.context";
import { useForm } from "@/hooks/useForm";
import { isInCheck } from "./game.logic";


export default function BoardComponent() {
  const { user } = useAuth()
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
    sendGameMessage,
    joinRandomGame
  } = useChess()

  const [loading, setLoading] = useState(true)
  const [opponent, setOpponent] = useState(null)
  const [moveNames, setMoveNames] = useState({}) 
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [highlightedSquares, setHighlightedSquares] = useState([])
  const [promotionData, setPromotionData] = useState(null)
  const [hideId, setHideId] = useState(false)
  const [copied, setCopied] = useState(false)
  const [formData, handleChange] = useForm({ message: "" })
  const [activeMessage , setActiveMessage] = useState(null)
  
  const handleSend = async (e) => {
    e.preventDefault()
    
    if(!formData.message.trim()) return
    await sendGameMessage(formData)
    
    showBubble(formData.message, user._id)
    e.target.reset()
  }
  
  const showBubble = async (message, senderId) => {
    setActiveMessage({ message, senderId })
    
    setTimeout(() => {
      setActiveMessage(null)
    }, 10000)
  }
  
  const MessageBubble = ({ isMine }) => {
      if (!activeMessage || (isMine && activeMessage.senderId !== user._id) || (!isMine && activeMessage.senderId === user._id)) return null;
      
      return (
        <div className={`absolute z-[120] bottom-full mb-2 animate-in slide-in-from-bottom-2 fade-in duration-300
          ${isMine ? 'right-0' : 'left-0'}`}>
          <div className="bg-indigo-600 text-white text-[11px] font-bold py-2 px-4 rounded-2xl rounded-br-none shadow-xl whitespace-nowrap">
            {activeMessage.message}
            {/* Little tail for the bubble */}
            <div className={`absolute top-full size-2 bg-indigo-600 rotate-45 -translate-y-1 ${isMine ? 'right-2' : 'left-2'}`} />
          </div>
        </div>
      );
    };
  
  useEffect(() => {
    const path = window.location.pathname
    const newGameId = path.split("/")[2]
    
    socket.emit("join-game-room", newGameId)
    socket.on("player-joined", ({ playerColor, opponent }) => {
      setPlayerColor(playerColor)
      setOpponent(opponent)
    })
    socket.on("data", ({ board, turn, stalemate: s, checkmate: c }) => {
      setGameId(newGameId)
      setBoard(board)
      setTurn(turn)
      if (s) setStalemate(true)
      if (c) setCheckmate(true)
    })
    socket.on("sync-players", ({ player1, player2 }) => {
      const syncOpponent = player1._id === user._id ? player2 : player1
      setOpponent(syncOpponent)
    })
    socket.on("game-message", (data) => {
        showBubble(data.message , data.senderId);
    });
    
    setLoading(false)
    return () => {
      socket.off("player-joined")
      socket.off("data")
      socket.off("sync-players")
      socket.off("game-message")
    }
  }, [])
  
  const copyToClipboard = () => {
    if (!gameId) return;
    navigator.clipboard.writeText(gameId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const promotion = () => {
    if (!promotionData) return null
    const { from, to } = promotionData
    const color = from.piece.color
    const nextTurn = turn === "white" ? "black" : "white"
    
    const handlePromotion = (chosenPiece: Piece) => {
      const promotedPiece = { ...chosenPiece, hasMoved: true }
      setBoard(prev => {
        const newBoard = [...prev]
        newBoard[to.row][to.col].piece = promotedPiece
        newBoard[from.row][from.col].piece = null
        const oppCheck = isInCheckmate(newBoard, nextTurn), oppStale = isInStalemate(newBoard, nextTurn);
        setStalemate(oppStale); setCheckmate(oppCheck);
        updateBoardForEveryone(newBoard, nextTurn, { stalemate: oppStale, checkmate: oppCheck })
        return newBoard
      })
      setPromotionData(null); setSelectedPiece(null); setHighlightedSquares([]); setMoveNames({}); setTurn(nextTurn);
    }

    const promotionOptions = color === "white" ? 
      [{ piece: whiteQueen, img: whiteQueen.image }, { piece: whiteRook, img: whiteRook.image }, { piece: whiteBishop, img: whiteBishop.image }, { piece: whiteKnight, img: whiteKnight.image }] : 
      [{ piece: blackQueen, img: blackQueen.image }, { piece: blackRook, img: blackRook.image }, { piece: blackBishop, img: blackBishop.image }, { piece: blackKnight, img: blackKnight.image }];

    return (
      <div className={`flex gap-2 p-1 bg-slate-900 border border-white/10 rounded-xl ${playerColor === 'black' ? 'rotate-180' : ''}`}>
        {promotionOptions.map((opt, index) => (
          <button key={index} onClick={() => handlePromotion(opt.piece)} className="p-2 hover:bg-white/5 rounded-lg">
            <img src={opt.img} className="w-10 h-10 sm:w-12 sm:h-12" alt="promo" />
          </button>
        ))}
      </div>
    )
  }

  const handleClick = (row: number, col: number) => {
    console.log(opponent)
    if (isHighlighted(row, col) && selectedPiece) {
      const updatedPiece = { ...selectedPiece.piece, hasMoved: true }
      const nextTurn = turn === "white" ? "black" : "white"
      const currentSpecialMove = moveNames[`${row}-${col}`]
      if (currentSpecialMove === "promotion") {
        setPromotionData({ from: selectedPiece, to: { row, col } })
        return
      }
      setBoard(prev => {
        const newBoard = [...prev]
        if (currentSpecialMove == "twoSteps") updatedPiece.enPassantable = true
        if (currentSpecialMove === "enPassantLeft") newBoard[selectedPiece.row][selectedPiece.col - 1].piece = null
        if (currentSpecialMove === "enPassantRight") newBoard[selectedPiece.row][selectedPiece.col + 1].piece = null
        if (currentSpecialMove === "queenSideCastle") {
          newBoard[selectedPiece.row][selectedPiece.col - 4].piece = null
          newBoard[selectedPiece.row][selectedPiece.col - 1].piece = updatedPiece.color == "white" ? { ...whiteRook, hasMoved: true, canCastle: false } : { ...blackRook, hasMoved: true, canCastle: false }
        }
        if (currentSpecialMove === "kingSideCastle") {
          newBoard[selectedPiece.row][selectedPiece.col + 3].piece = null
          newBoard[selectedPiece.row][selectedPiece.col + 1].piece = updatedPiece.color == "white" ? { ...whiteRook, hasMoved: true, canCastle: false } : { ...blackRook, hasMoved: true, canCastle: false }
        }
        newBoard[row][col].piece = updatedPiece
        newBoard[selectedPiece.row][selectedPiece.col].piece = null
        const oppCheck = isInCheckmate(newBoard, nextTurn), oppStale = isInStalemate(newBoard, nextTurn);
        setStalemate(oppStale); setCheckmate(oppCheck);
        updateBoardForEveryone(newBoard, nextTurn, { stalemate: oppStale, checkmate: oppCheck })
        return newBoard
      })
      setSelectedPiece(null); setHighlightedSquares([]); setMoveNames({}); setTurn(nextTurn); return
    }
    const { selected, moves, newMoveNames } = selectPiece(board, row, col, turn, playerColor)
    setSelectedPiece(selected); setHighlightedSquares(moves); setMoveNames(newMoveNames);
  }

  const isHighlighted = (row: number, col: number) => highlightedSquares.some(s => s[0] === row && s[1] === col)

  // Use the global states directly for the modal trigger
  const userWon = checkmate && playerColor !== turn;

  return (
    <div className="flex flex-col h-screen bg-[#0b0f1a] w-full pt-20 sm:pt-24 overflow-hidden">
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="size-8 border-2 border-indigo-500/20 border-t-indigo-500 animate-spin rounded-full" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400">Arena Initializing</span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-0 sm:p-8">
          
          {/* TOP HEADER: STATUS & ID (RESTORED) */}
          <div className="w-full max-w-[600px] flex items-center justify-between px-6 sm:px-0 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5">
              <div className={`size-1.5 rounded-full ${turn === playerColor ? 'bg-indigo-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                {turn === playerColor ? "Your Move" : "Opponent"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={copyToClipboard} className="group px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 active:scale-95 transition-all">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-indigo-400 transition-colors">
                  {copied ? "Copied!" : (hideId ? "********" : gameId?.slice(0 , 10).toUpperCase() + "...")}
                </span>
              </button>
              <button 
                onClick={() => setHideId(!hideId)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-600 hover:text-slate-300 transition-colors"
              >
                {hideId ? (
                  <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                ) : (
                  <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                )}
              </button>
            </div>
          </div>

          <main className="w-full max-w-[600px] relative">
            <div className="flex items-center gap-3 px-4 sm:px-0 p-5">
                <div className="relative">
                <MessageBubble isMine={false} />
                <img 
                  src={opponent?.profilePicture?.url || "https://via.placeholder.com/40"} 
                  className="size-10 rounded-xl border border-white/10 object-cover" 
                  alt="opponent" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Opponent</span>
                <span className="text-sm font-bold text-white leading-none">
                  {opponent?.username || "Waiting for challenger..."}
                </span>
              </div>
            </div>
              
            {/* BOARD CONTAINER */}
            <div className={`relative w-full aspect-square bg-[#0b0f1a] border-y sm:border border-white/5 ${playerColor === 'black' ? 'rotate-180' : ''}`}>
              <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                {board?.map((r, rIdx) => r.map((square, cIdx) => {
                  const isDark = (rIdx + cIdx) % 2 === 1;
                  const highlighted = isHighlighted(rIdx, cIdx);
                  const isSelected = selectedPiece?.row === rIdx && selectedPiece?.col === cIdx;
                  
                  const kingIsInCheck = square?.piece?.type === "king" && isInCheck(board , square.piece.color);
                  return (
                    <button key={`${rIdx}-${cIdx}`} onClick={() => handleClick(rIdx, cIdx)}
                      className={`relative flex items-center justify-center transition-colors duration-150
                        ${isDark ? 'bg-[#141a29]' : 'bg-[#1d2436]'}
                        ${isSelected ? 'bg-indigo-500/15' : ''}
                        ${highlighted && !square?.piece ? 'after:content-[""] after:size-2 after:bg-indigo-400/30 after:rounded-full' : ''}
                        ${highlighted && square?.piece ? 'bg-red-500/10' : ''}
                        ${kingIsInCheck && "bg-red-500/10"} `}
                    >
                      {square?.piece && <img src={square.piece.image} className={`w-[82%] h-[82%] z-10 select-none ${playerColor === 'black' ? 'rotate-180' : ''}`} alt="" />}
                    </button>
                  );
                }))}
              </div>

              {promotionData && (
                <div className="absolute inset-0 z-[110] flex items-center justify-center bg-[#0b0f1a]/80 backdrop-blur-sm">
                  {promotion()}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 px-4 sm:px-0 p-5">
                <div className="relative">
                <MessageBubble isMine={true} />
                <img 
                  src={user?.profilePicture?.url || "https://via.placeholder.com/40"} 
                  className="size-10 rounded-xl border border-white/10 object-cover" 
                  alt="user" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">you</span>
                <span className="text-sm font-bold text-white leading-none">
                  {user?.username || "Waiting for challenger..."}
                </span>
              </div>
              <form 
                  onSubmit={handleSend} 
                  className="flex-1 max-w-[240px] flex items-center gap-2 group"
                >
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      name="message" 
                      placeholder="Say something..." 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-[11px] text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all active:scale-90 disabled:opacity-50 disabled:hover:bg-indigo-600"
                    disabled={!formData.message?.trim()}
                  >
                    <svg className="size-3.5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
            </div>  
            
            {/* GAME OVER MODAL: OUTSIDE ROTATED DIV SO IT'S ALWAYS UPRIGHT */}
            {(checkmate || stalemate) && (
              <div className="absolute inset-0 z-[150] flex items-center justify-center px-6 pointer-events-none">
                <div className="absolute inset-0 bg-[#0b0f1a]/60 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-auto" />
                
                <div className="relative w-full max-w-[280px] sm:max-w-sm bg-slate-900 border border-white/10 rounded-[2rem] p-8 text-center space-y-6 animate-in zoom-in-95 duration-300 pointer-events-auto">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Match Concluded</span>
                    <h2 className="text-3xl font-black text-white tracking-tighter">
                      {checkmate ? (userWon ? "Victory!" : "Defeat") : "Stalemate"}
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed px-4">
                      {checkmate ? (userWon ? "You mastered the arena" : "Your opponent claimed the win") : "Neither side could prevail"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                      <button onClick={joinRandomGame} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-[0.98]">
                      Play Again
                    </button>
                    <button onClick={() => window.location.href = "/"} className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl border border-white/5 transition-all">
                      Leave Arena
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
          
          <div className="mt-12 text-[9px] font-black uppercase tracking-[0.5em] text-slate-800">
            ReChess Engine v1.0
          </div>
        </div>
      )}
    </div>
  )
}