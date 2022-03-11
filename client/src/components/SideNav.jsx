import React from 'react';

const SideNav = () => {
  return (
    <div className="bg-primary-black">
      <img src="assets/PNGs/Waypost_logo_on_dark.png" alt="Waypost" />
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