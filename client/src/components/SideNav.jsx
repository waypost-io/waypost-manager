import React from 'react';

const SideNav = () => {
  return (
    <div className="sidenav">
      <img src="assets/PNGs/Waypost_graphic_on dark.png" alt="Waypost" width="80%"/>
      {/* <h1 className="header">Waypost</h1> */}
      <ul className="sidenav-list">
        <a href="/"><li>Flags Dashboard</li></a>
        <li>Event Log</li>
        <li>Tech Debt Dashboard</li>
        <li>Get a new SDK Key</li>
      </ul>
    </div>
  );
};

export default SideNav;