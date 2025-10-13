import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  CommandLineIcon,
  HomeIcon,
  FolderIcon,
  CheckIcon,
  ChartBarIcon,
  UsersIcon,
  CogIcon,
  PlusIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

import { toggleCommandPalette } from '../../store/slices/uiSlice';

const CommandPalette = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { commandPaletteOpen } = useSelector((state) => state.ui);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      subtitle: 'View your main dashboard',
      icon: HomeIcon,
      action: () => navigate('/dashboard'),
      keywords: ['dashboard', 'home', 'overview'],
    },
    {
      id: 'projects',
      title: 'Go to Projects',
      subtitle: 'Manage your projects',
      icon: FolderIcon,
      action: () => navigate('/projects'),
      keywords: ['projects', 'project', 'folder'],
    },
    {
      id: 'tasks',
      title: 'Go to Tasks',
      subtitle: 'View and manage tasks',
      icon: CheckIcon,
      action: () => navigate('/tasks'),
      keywords: ['tasks', 'task', 'todo', 'work'],
    },
    {
      id: 'analytics',
      title: 'Go to Analytics',
      subtitle: 'View reports and analytics',
      icon: ChartBarIcon,
      action: () => navigate('/analytics'),
      keywords: ['analytics', 'reports', 'stats', 'data'],
    },
    {
      id: 'team',
      title: 'Go to Team',
      subtitle: 'Manage team members',
      icon: UsersIcon,
      action: () => navigate('/team'),
      keywords: ['team', 'members', 'users', 'people'],
    },
    {
      id: 'settings',
      title: 'Go to Settings',
      subtitle: 'Configure your preferences',
      icon: CogIcon,
      action: () => navigate('/settings'),
      keywords: ['settings', 'preferences', 'config'],
    },
    {
      id: 'new-project',
      title: 'Create New Project',
      subtitle: 'Start a new project',
      icon: PlusIcon,
      action: () => navigate('/projects/new'),
      keywords: ['new', 'create', 'project', 'add'],
    },
    {
      id: 'new-task',
      title: 'Create New Task',
      subtitle: 'Add a new task',
      icon: PlusIcon,
      action: () => navigate('/tasks/new'),
      keywords: ['new', 'create', 'task', 'add', 'todo'],
    },
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    command.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
  );

  const executeCommand = (command) => {
    command.action();
    closeCommandPalette();
  };

  const closeCommandPalette = () => {
    dispatch(toggleCommandPalette());
    setQuery('');
    setSelectedIndex(0);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!commandPaletteOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          closeCommandPalette();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, filteredCommands, selectedIndex, closeCommandPalette, executeCommand]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(toggleCommandPalette());
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [dispatch]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const paletteVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: -20 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    },
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeCommandPalette}
          />

          {/* Command Palette */}
          <motion.div
            className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl mx-4"
            variants={paletteVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="glass-card rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header */}
              <div className="flex items-center p-4 border-b border-white/10">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg">
                    <CommandLineIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Command Palette
                    </h2>
                    <p className="text-sm text-white/60">
                      Type to search for commands and actions
                    </p>
                  </div>
                </div>
                <div className="text-xs text-white/40 bg-white/10 px-2 py-1 rounded">
                  ESC
                </div>
              </div>

              {/* Search Input */}
              <div className="p-4 border-b border-white/10">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search commands..."
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>

              {/* Commands List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredCommands.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MagnifyingGlassIcon className="w-8 h-8 text-white/50" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      No commands found
                    </h3>
                    <p className="text-white/60">
                      Try searching for something else
                    </p>
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredCommands.map((command, index) => (
                      <motion.button
                        key={command.id}
                        className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                          index === selectedIndex
                            ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 neon-glow'
                            : 'hover:bg-white/10'
                        }`}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.05 }}
                        onClick={() => executeCommand(command)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <div className={`p-2 rounded-lg mr-3 ${
                          index === selectedIndex
                            ? 'bg-gradient-to-br from-neon-blue to-neon-purple'
                            : 'bg-white/10'
                        }`}>
                          <command.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-medium text-white">
                            {command.title}
                          </h4>
                          <p className="text-sm text-white/60">
                            {command.subtitle}
                          </p>
                        </div>
                        <ArrowRightIcon className="w-4 h-4 text-white/40" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10 bg-white/5">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">↑↓</kbd>
                      <span>Navigate</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">Enter</kbd>
                      <span>Select</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">Esc</kbd>
                      <span>Close</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">K</kbd>
                    <span>to open</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;