import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Home from './components/Home';
import ReservationList from './components/ReservationList';
import ReservationDetail from './components/ReservationDetail';
// import ReservationForm from './components/ReservationForm';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <h1>Hilton Restaurant Reservations</h1> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reservationList" element={<ReservationList />} />
          <Route path="/reserve" element={<ReservationDetail />} />
          <Route path="/reservation/:id" element={<ReservationDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
