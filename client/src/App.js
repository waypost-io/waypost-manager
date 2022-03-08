import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import FlagDashboard from './components/FlagDashboard';
import SideNav from './components/SideNav';
import FlagDetailsPage from './components/FlagDetailsPage';

function App() {
  return (
    <main className="flag-dashboard">
      <SideNav />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<FlagDashboard />} />
          <Route path="/flags/:flagId" element={<FlagDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
