import './App.css';
import Header from './components/Header';
import SideNav from './components/SideNav';
import FlagsList from' ./components/FlagsList';

function App() {
  return (
    <>
      <Header />
      <main>
        <SideNav />
        <FlagsList />
      </main>
    </>
  );
}

export default App;
