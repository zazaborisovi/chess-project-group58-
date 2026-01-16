import { Route, Routes } from 'react-router';
import SignUp from './pages/Signup.tsx';
import Signin from './pages/Signin.tsx';
import { ToastContainer } from 'react-toastify';
import ChessProvider from './contexts/chess.context.tsx';
import GameRoom from './pages/GameRoom';
import { Protect } from './contexts/utils/Protect.tsx';
import BoardComponent from './chess/Board.tsx';
import Friends from './pages/Friends.tsx';
import FriendProvider from './contexts/friends.context.tsx';
import FriendRequestPage from './pages/FriendRequest.tsx';
import NavComponent from './pages/components/Nav.tsx';
import ControlPanelProvider from './contexts/control.panel.context.tsx';
import ControlPanel from './pages/ControlPanel.tsx';
import {AuthProvider, useAuth} from './contexts/auth.context';
import ChatProvider from './contexts/chat.context.tsx';
import ChatPage from './pages/Chat.tsx';
import ProfilePage from './pages/Profile.tsx';
import LeaderboardPage from './pages/Leaderboard.tsx';
import LeaderBoardProvider from './contexts/leaderboard.context.tsx';
import SocketProvider from './contexts/utils/socket.context.tsx';

export default function App() {
  const {user} = useAuth()
  
  return(
    <>
      {/*<Board />*/}
      <NavComponent />
      <SocketProvider>
        <ChatProvider>
        <Routes>
          <Route path="/game" element={
              <AuthProvider>
                <Protect>
                  <ChessProvider>
                    <GameRoom />
                  </ChessProvider>
                </Protect>
              </AuthProvider>
          }/>
          <Route path='/friends' element={
            <Protect>
              <FriendProvider>
                <Friends/>
              </FriendProvider>
            </Protect>
          }/>
          <Route path='/requests' element={
            <Protect>
              <FriendProvider>
                <FriendRequestPage/>
              </FriendProvider>
            </Protect>
          }/>
          <Route path="/game/:id" element={
            <Protect>
              <ChessProvider>
                <BoardComponent />
              </ChessProvider>
            </Protect>
          } />
          <Route path="/chat/:chatId" element={
            <Protect>
              <ChatPage />
            </Protect>
          } />
          <Route path="/profile" element={
            <Protect>
              <FriendProvider>
                <ProfilePage />
              </FriendProvider>
            </Protect>
          } />
          {
            user?.role === "admin" || user?.role === "moderator" ? (
              <Route path="/control-panel" element={
                <Protect>
                  <ControlPanelProvider>
                    <ControlPanel />
                  </ControlPanelProvider>
                </Protect>
              }/>
            ) : null
          }
          <Route path="/leaderboard" element={
            <Protect>
              <LeaderBoardProvider>
                <LeaderboardPage />
              </LeaderBoardProvider>
            </Protect>
          } />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<Signin />} />
          {/*<Route path="/profile" element={<Profile />} />*/}
          </Routes>
        </ChatProvider>
      </SocketProvider>
      <ToastContainer />
    </>
  )
}
