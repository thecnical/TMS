import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  ArrowLeftIcon,
  SparklesIcon,
  RocketLaunchIcon 
} from '@heroicons/react/24/outline';

import Button from '../../components/UI/Button';

const NotFound = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-blue/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neon-pink/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Floating Icons */}
      <motion.div
        className="absolute top-20 left-20 text-neon-blue/30"
        variants={floatingVariants}
        animate="animate"
      >
        <SparklesIcon className="w-8 h-8" />
      </motion.div>
      <motion.div
        className="absolute top-40 right-32 text-neon-purple/30"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <RocketLaunchIcon className="w-10 h-10" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-40 text-neon-pink/30"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      >
        <SparklesIcon className="w-6 h-6" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="text-center relative z-10 max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Number */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <motion.h1
            className="text-9xl md:text-[12rem] font-bold aurora-text leading-none"
            animate={{
              textShadow: [
                '0 0 20px rgba(0, 245, 255, 0.5)',
                '0 0 40px rgba(191, 0, 255, 0.5)',
                '0 0 20px rgba(255, 0, 128, 0.5)',
                '0 0 20px rgba(0, 245, 255, 0.5)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            404
          </motion.h1>
        </motion.div>

        {/* Error Message */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-white/80 mb-2">
            The page you're looking for seems to have vanished into the digital void.
          </p>
          <p className="text-white/60">
            Don't worry, even the best explorers sometimes take a wrong turn in cyberspace.
          </p>
        </motion.div>

        {/* Illustration */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="inline-block p-8 glass-card rounded-2xl"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              🚀
            </motion.div>
            <p className="text-white/80 text-sm">
              Lost in space?
            </p>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <Button
            as={Link}
            to="/"
            size="lg"
            className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-pink text-white font-semibold shadow-lg hover:shadow-xl neon-glow"
            leftIcon={<HomeIcon className="w-5 h-5" />}
          >
            Back to Home
          </Button>
          
          <Button
            onClick={() => window.history.back()}
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
            leftIcon={<ArrowLeftIcon className="w-5 h-5" />}
          >
            Go Back
          </Button>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          className="mt-12 p-6 glass-card rounded-xl"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-white mb-3">
            Need Help?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <Link
              to="/dashboard"
              className="text-neon-blue hover:text-neon-purple transition-colors"
            >
              📊 Dashboard
            </Link>
            <Link
              to="/projects"
              className="text-neon-blue hover:text-neon-purple transition-colors"
            >
              📁 Projects
            </Link>
            <Link
              to="/tasks"
              className="text-neon-blue hover:text-neon-purple transition-colors"
            >
              ✅ Tasks
            </Link>
          </div>
        </motion.div>

        {/* Fun Fact */}
        <motion.div
          className="mt-8 text-white/60 text-sm"
          variants={itemVariants}
        >
          <p>
            Fun fact: The first 404 error was discovered at CERN in 1992. 
            You're now part of internet history! 🌐
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;