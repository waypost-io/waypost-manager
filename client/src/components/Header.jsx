import React from "react";
import DatabaseConnection from './DatabaseConnection';

const Header = ({ dbName, setDbName, setDbModalOpen }) => {
  return (
    <header className="bg-primary-black text-primary-offwhite w-full h-8">
      <h1>Waypost</h1>
      <DatabaseConnection dbName={dbName} setDbName={setDbName} setDbModalOpen={setDbModalOpen}/>
    </header>
  );
};

export default Header;
