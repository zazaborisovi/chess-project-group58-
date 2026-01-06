import { Route, Routes } from 'react-router';
import SignUp from './pages/Signup.tsx';
import Signin from './pages/Signin.tsx';
import { ToastContainer } from 'react-toastify';
import ChessProvider from './contexts/chess.context.tsx';
import GameRoom from './pages/GameRoom';
import { Protect } from './contexts/utils/Protect.tsx';
import BoardComponent from './chess/Board.tsx';
import Friends from './pages/Friends.tsx';
import Signout from './components/Signout.tsx';
import FriendProvider from './contexts/friends.context.tsx';
import FriendRequestPage from './pages/FriendRequest.tsx';
import NavComponent from './pages/components/Nav.tsx';

export default function App() {
  return(
    <>
      {/*<Board />*/}
      <NavComponent />
      <Routes>
        <Route path="/" element={
          <Protect>
            <ChessProvider>
              <GameRoom />
            </ChessProvider>
          </Protect>
        }/>
        <Route path='/friends' element={
          <Protect>
            <FriendProvider>
              <Friends />
            </FriendProvider>
          </Protect>
        }/>
        <Route path='/friend-requests' element={
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
        }/>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Signin />} />
        {/*<Route path="/profile" element={<Profile />} />*/}
      </Routes>
      <ToastContainer />
    </>
  )
}
