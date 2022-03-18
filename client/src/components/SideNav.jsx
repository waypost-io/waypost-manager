import React from 'react';
import { useNavigate } from 'react-router-dom';

const navLinks =[
  { id: 1, title: 'Flags Dashboard', path: "/" },
  { id: 2, title: 'Metrics', path: '/metrics' },
  { id: 3, title: 'Get an SDK Key', path: "/"}
]

const SideNav = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-primary-black text-primary-offwhite min-h-screen w-80 min-w-min">
      <img src="/assets/PNGs/Waypost_logo_on_dark.png" alt="Waypost" />
      <ul className="font-bold p-0">
        {navLinks.map(item => {
          return (
            <li key={`li-${item.id}`} onClick={() => navigate(item.path)} className="p-5 hover:cursor-pointer hover:bg-primary-violet hover:text-primary-offwhite">{item.title}</li>
            )
        })}
      </ul>
    </div>
  );
};

export default SideNav;