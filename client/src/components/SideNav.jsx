import React from 'react';
import { useNavigate } from 'react-router-dom';

const navLinks =[
  { id: 1, title: 'Flags Dashboard', path: "/", testid: 'flagsLink' },
  { id: 2, title: 'Metrics', path: '/metrics', testid: 'metricsLink' },
  { id: 3, title: 'Flag Events Log', path: '/log', testid: 'logLink' },
  { id: 4, title: 'SDK Key', path: "/sdkKey", testid: 'sdkKeyLink' }
]

const SideNav = () => {
  const navigate = useNavigate();
  return (
    <div className="font-display bg-primary-black text-primary-offwhite min-h-screen w-64 min-w-min">
      <img src="/assets/PNGs/Waypost_logo_on_dark.png" alt="Waypost" />
      <ul className="font-bold p-0">
        {navLinks.map(item => {
          return (
            <li key={`li-${item.id}`} onClick={() => navigate(item.path)} data-testid={item.testid} className="navlink p-5 hover:cursor-pointer relative z-10">{item.title}</li>
            )
        })}
      </ul>
    </div>
  );
};

export default SideNav;
