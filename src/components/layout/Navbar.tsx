import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, CreditCard, User, FileText, Home } from 'lucide-react';
import AppLogo from '@/components/shared/Logo';

const Navbar: React.FC = () => {
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 w-full max-w-md mx-auto"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <nav className="bg-[#1A1A1A]/80 backdrop-blur-md p-3 rounded-full flex justify-between items-center shadow-lg border border-[#242425]">
        <Link to="/">
          <div className={`p-2 rounded-full ${isActive('/') ? 'bg-[#C6FE1E] text-[#0D0D0D]' : 'text-[#868686] hover:text-white'}`}>
            <Home size={24} />
          </div>
        </Link>
        
        <Link to="/transactions">
          <div className={`p-2 rounded-full ${isActive('/transactions') ? 'bg-[#C6FE1E] text-[#0D0D0D]' : 'text-[#868686] hover:text-white'}`}>
            <FileText size={24} />
          </div>
        </Link>
        
        <Link to="/wallets">
          <div className={`p-2 rounded-full ${isActive('/wallets') ? 'bg-[#C6FE1E] text-[#0D0D0D]' : 'text-[#868686] hover:text-white'}`}>
            <CreditCard size={24} />
          </div>
        </Link>
        
        <Link to="/statistics">
          <div className={`p-2 rounded-full ${isActive('/statistics') ? 'bg-[#C6FE1E] text-[#0D0D0D]' : 'text-[#868686] hover:text-white'}`}>
            <BarChart3 size={24} />
          </div>
        </Link>

        <Link to="/profile">
          <div className={`p-2 rounded-full ${isActive('/profile') ? 'bg-[#C6FE1E] text-[#0D0D0D]' : 'text-[#868686] hover:text-white'}`}>
            <User size={24} />
          </div>
        </Link>
      </nav>
    </motion.div>
  );
};

export default Navbar;
