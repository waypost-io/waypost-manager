import React from "react";

const Header = () => {
  return (
    <header className="w-full p-4 bg-primary-black border-b-2 border-b-primary-violet text-primary-offwhite font-display text-xl">
      <a href="/" className="hover:text-secondary-skyblue"><h1>Waypost</h1></a>
    </header>
  );
};

export default Header;