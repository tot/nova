import { ReactNode } from 'react';
import Navbar from '../components/Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="w-full min-h-screen h-full flex-1 flex bg-[#121214]">
      <Navbar />

      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}

export default MainLayout;
