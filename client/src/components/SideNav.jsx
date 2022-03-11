import React from 'react';

const navLinks =[
  { title: 'Flags Dashboard', path: "/" },
  { title: 'Event Log', path: "/"},
  { title: 'Get an SDK Key', path: "/"}
]

const SideNav = () => {
  return (
    <div className="bg-primary-black text-primary-offwhite min-h-screen w-80 min-w-min">
      <img src="assets/PNGs/Waypost_logo_on_dark.png" alt="Waypost" />
      <ul className="font-bold p-0">
        {navLinks.map(item => {
          return (
            <a href={item.path}>
              <li className="p-5 hover:bg-primary-violet hover:text-primary-offwhite">{item.title}</li>
            </a>
            )
        })}
      </ul>
    </div>
  );
};

export default SideNav;