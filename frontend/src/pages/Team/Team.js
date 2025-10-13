import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

import Button, { IconButton } from '../../components/UI/Button';
import { useDebounce } from '../../hooks/useDebounce';

const Team = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Mock team data
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      status: 'active',
      avatar: null,
      joinDate: '2023-01-15',
      lastActive: '2024-01-15T10:30:00Z',
      tasksCompleted: 45,
      projectsAssigned: 8,
      department: 'Engineering',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'manager',
      status: 'active',
      avatar: null,
      joinDate: '2023-02-20',
      lastActive: '2024-01-15T09:15:00Z',
      tasksCompleted: 32,
      projectsAssigned: 5,
      department: 'Design',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'member',
      status: 'active',
      avatar: null,
      joinDate: '2023-03-10',
      lastActive: '2024-01-14T16:45:00Z',
      tasksCompleted: 28,
      projectsAssigned: 3,
      department: 'Marketing',
      phone: '+1 (555) 345-6789',
      location: 'Chicago, IL',
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      role: 'member',
      status: 'inactive',
      avatar: null,
      joinDate: '2023-04-05',
      lastActive: '2024-01-10T14:20:00Z',
      tasksCompleted: 15,
      projectsAssigned: 2,
      department: 'Sales',
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX',
    },
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const roles = [
    { value: 'admin', label: 'Admin', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    { value: 'manager', label: 'Manager', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { value: 'member', label: 'Member', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  ];

  const getRoleColor = (role) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.color : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         member.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         member.department.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleInviteMember = async () => {
    if (!inviteEmail) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newMember = {
        id: teamMembers.length + 1,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'pending',
        avatar: null,
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: null,
        tasksCompleted: 0,
        projectsAssigned: 0,
        department: 'Unassigned',
        phone: '',
        location: '',
      };
      
      setTeamMembers(prev => [...prev, newMember]);
      setInviteEmail('');
      setInviteRole('member');
      setShowInviteModal(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleRemoveMember = (memberId) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
  };



  const stats = [
    {
      title: 'Total Members',
      value: teamMembers.length,
      icon: UserGroupIcon,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: '+2 this month',
    },
    {
      title: 'Active Members',
      value: teamMembers.filter(m => m.status === 'active').length,
      icon: CheckCircleIcon,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      change: '95% active rate',
    },
    {
      title: 'Pending Invites',
      value: teamMembers.filter(m => m.status === 'pending').length,
      icon: ClockIcon,
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      change: '2 awaiting response',
    },
    {
      title: 'Departments',
      value: [...new Set(teamMembers.map(m => m.department))].length,
      icon: ChartBarIcon,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      change: '4 departments',
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
            Team Management
          </h1>
          <p className="mt-1 text-secondary-600 dark:text-secondary-400">
            Manage team members, roles, and permissions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            leftIcon={<UserPlusIcon className="w-4 h-4" />}
            onClick={() => setShowInviteModal(true)}
            className="neon-glow"
          >
            Invite Member
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={itemVariants}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="card p-6 hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  {stat.title}
                </p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-secondary-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <p className="text-xs text-secondary-500 dark:text-secondary-500 mt-1">
                  {stat.change}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        variants={itemVariants}
      >
        <div className="flex flex-1 max-w-md">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-secondary-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team members..."
              className="block w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </motion.div>

      {/* Team Members Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredMembers.map((member, index) => (
          <motion.div
            key={member.id}
            className="card p-6 hover:shadow-xl transition-all duration-300 group"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {member.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <IconButton variant="ghost" size="sm">
                  <EyeIcon className="w-4 h-4" />
                </IconButton>
                <IconButton variant="ghost" size="sm">
                  <PencilIcon className="w-4 h-4" />
                </IconButton>
                <IconButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  <TrashIcon className="w-4 h-4 text-red-500" />
                </IconButton>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                  {member.role}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                  {member.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span className="truncate">{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                )}
                {member.location && (
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{member.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-secondary-200 dark:border-secondary-700">
                <div className="flex justify-between text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-secondary-900 dark:text-white">
                      {member.tasksCompleted}
                    </p>
                    <p className="text-secondary-600 dark:text-secondary-400">Tasks</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-secondary-900 dark:text-white">
                      {member.projectsAssigned}
                    </p>
                    <p className="text-secondary-600 dark:text-secondary-400">Projects</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-secondary-900 dark:text-white">
                      {member.lastActive ? new Date(member.lastActive).toLocaleDateString() : 'Never'}
                    </p>
                    <p className="text-secondary-600 dark:text-secondary-400">Last Active</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-24 h-24 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserGroupIcon className="w-12 h-12 text-secondary-400" />
          </div>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            No team members found
          </h3>
          <p className="text-secondary-500 dark:text-secondary-400 mb-6">
            {searchQuery ? 'Try adjusting your search criteria' : 'Get started by inviting your first team member'}
          </p>
          {!searchQuery && (
            <Button
              leftIcon={<UserPlusIcon className="w-4 h-4" />}
              onClick={() => setShowInviteModal(true)}
            >
              Invite Team Member
            </Button>
          )}
        </motion.div>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInviteModal(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-2xl w-full max-w-md p-6">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                  Invite Team Member
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Role
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowInviteModal(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleInviteMember}
                    loading={isLoading}
                    disabled={!inviteEmail}
                  >
                    Send Invite
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Team;