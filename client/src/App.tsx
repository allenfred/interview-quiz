import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './components/Home';
import Entrance from './components/Entrance';
import Signup from './components/Signup';
import ReservationList from './components/ReservationList';
import ReservationForm from './components/ReservationForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/entrance" element={<Entrance />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reservationList" element={<ReservationList />} />
          <Route path="/reserve" element={<ReservationForm />} />
          <Route path="/reservation/:id" element={<ReservationForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
