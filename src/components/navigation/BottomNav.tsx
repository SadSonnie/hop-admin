import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiDashboardLine } from 'react-icons/ri';
import { IoStatsChartOutline } from 'react-icons/io5';

type TabType = '/' | '/metrics';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname as TabType;

  const tabs = [
    { id: '/' as TabType, label: 'Контент', icon: RiDashboardLine },
    { id: '/metrics' as TabType, label: 'Метрики', icon: IoStatsChartOutline },
  ];

  const handleNavigation = (path: TabType) => {
    // Сначала прокручиваем страницу вверх
    window.scrollTo(0, 0);
    // Затем выполняем навигацию
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-3xl h-[90px] w-full z-50">
      <div className="flex justify-center items-center gap-24 h-full">
        {tabs.map((tab) => (
          <motion.div
            key={tab.id}
            layout
            className={`relative flex items-center justify-center ${
              activeTab === tab.id ? 'w-[97px]' : 'w-[40px]'
            } h-[40px] sm:h-[48px] sm:w-[120px]`}
            transition={{ 
              duration: 0.9,
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
          >
            <button
              onClick={() => handleNavigation(tab.id)}
              className="flex items-center justify-center h-full w-full"
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="bubble"
                  className="absolute inset-0 border-[1.5px] border-[#1e47f7] rounded-[100px] -z-10"
                  transition={{ 
                    duration: 0.2,
                    type: "spring",
                    stiffness: 350,
                    damping: 40
                  }}
                />
              )}
              <motion.div 
                className="flex items-center justify-center gap-2"
                layout
                transition={{ duration: 0.1 }}
              >
                <motion.div
                  className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-300 ${
                    activeTab === tab.id ? 'text-[#1e47f7]' : 'text-gray-400'
                  }`}
                  layout
                >
                  {React.createElement(tab.icon, { className: 'w-full h-full' })}
                </motion.div>
                <AnimatePresence mode="wait">
                  {activeTab === tab.id && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.1 }}
                      className="text-xs font-medium text-[#1e47f7] sm:text-sm whitespace-nowrap overflow-hidden"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </button>
          </motion.div>
        ))}
      </div>
    </nav>
  );
};
