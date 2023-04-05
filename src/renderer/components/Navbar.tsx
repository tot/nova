import { useLocation, Link } from 'react-router-dom';
import cn from 'classnames';
import {
  AiOutlineSetting,
  AiOutlineHome,
  AiOutlineFolder,
  AiOutlineTeam,
} from 'react-icons/ai';
import { BiPlanet } from 'react-icons/bi';
import { useEffect, useState } from 'react';
// @ts-ignore
import PulseDot from 'react-pulse-dot';
import 'react-pulse-dot/dist/index.css';

const LINKS = [
  {
    name: 'Home',
    href: '/',
    icon: AiOutlineHome,
  },
  {
    name: 'Explorer',
    href: '/explorer',
    icon: AiOutlineFolder,
  },
  {
    name: 'Peers',
    href: '/peers',
    icon: AiOutlineTeam,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: AiOutlineSetting,
  },
];

function Navbar() {
  const location = useLocation();
  const [isListening, setListening] = useState(false);

  // Listen for connections on mount
  useEffect(() => {
    const getData = async () => {
      const res = await window.electron.ipcRenderer.invoke('listen', []);
      if (res.success) setListening(true);
    };

    getData();
  }, []);

  return (
    <div className="w-[14rem] flex bg-[#181818] border-r border-[#2a2a2b] select-none">
      <div className="flex-1 h-full p-4 flex flex-col">
        <div className="flex items-center space-x-2 pl-2">
          <BiPlanet className="text-xl text-zinc-50" />
          <h1 className="font-extrabold text-xl text-zinc-50">Nova</h1>
        </div>
        <div className="space-y-2 pt-4 text-base">
          {LINKS.map((link) => (
            <div>
              <Link to={link.href}>
                <div
                  className={cn(
                    'w-full p-2 rounded flex items-center space-x-2 border transition-colors duration-150 ease-in cursor-pointer',
                    {
                      'bg-[#242424] border-[#303030] shadow text-zinc-200':
                        link.href === location.pathname,
                      'text-neutral-500 hover:bg-zinc-100/[4%] border-transparent':
                        link.href !== location.pathname,
                    }
                  )}
                >
                  <link.icon className="text-lg" />
                  <span className="">{link.name}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-auto w-full flex items-center space-x-2">
          {isListening ? (
            <PulseDot color="success" style={{ fontSize: '0.5rem' }} />
          ) : (
            <div className="h-2 w-2 rounded-full bg-gray-500" />
          )}
          <span
            className={cn('text-sm', {
              'text-green-500': isListening,
              'text-gray-500': !isListening,
            })}
          >
            {isListening ? 'Node online' : 'Node offline'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
