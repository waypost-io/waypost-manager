import React from 'react';

const navLinks =[
  { id: 1, title: 'Flags Dashboard', path: "/" },
  { id: 2, title: 'Metrics', path: '/metrics' },
  { id: 3, title: 'Get an SDK Key', path: "/"}
]

const SideNav = () => {
  return (
    <div className="bg-primary-black text-primary-offwhite min-h-screen w-80 min-w-min">
      <img src="/assets/PNGs/Waypost_logo_on_dark.png" alt="Waypost" />
      <ul className="font-bold p-0">
        {navLinks.map(item => {
          return (
            <a key={`a-${item.id}`} href={item.path}>
              <li key={`li-${item.id}`} className="p-5 hover:bg-primary-violet hover:text-primary-offwhite">{item.title}</li>
            </a>
            )
        })}
      </ul>
    </div>
  );
};

export default SideNav;