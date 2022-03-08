import React from 'react';

const SideNav = () => {
  return (
    <div className="sidenav">
      <h1 className="header">Waypost</h1>
      <ul className="sidenav-list">
        <li><a href="/">Flags Dashboard</a></li>
        <li>Event Log</li>
        <li>Tech Debt Dashboard</li>
        <li>Get a new SDK Key</li>
      </ul>
    </div>
  );
};

export default SideNav;