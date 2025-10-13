import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

const initialState = {
  theme: getInitialTheme(),
  sidebarOpen: true,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  commandPaletteOpen: false,
  notificationPanelOpen: false,
  modals: {},
  loading: {},
  notifications: {
    show: true,
    position: 'top-right',
  },
  layout: {
    density: 'comfortable', // comfortable, compact, spacious
    animation: true,
    reducedMotion: false,
  },
  preferences: {
    autoSave: true,
    confirmDelete: true,
    showTooltips: true,
    keyboardShortcuts: true,
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    toggleCommandPalette: (state) => {
      state.commandPaletteOpen = !state.commandPaletteOpen;
    },
    toggleNotificationPanel: (state) => {
      state.notificationPanelOpen = !state.notificationPanelOpen;
    },
    openModal: (state, action) => {
      const { id, props = {} } = action.payload;
      state.modals[id] = {
        isOpen: true,
        props,
      };
    },
    closeModal: (state, action) => {
      const id = action.payload;
      if (state.modals[id]) {
        state.modals[id].isOpen = false;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(id => {
        state.modals[id].isOpen = false;
      });
    },
    setLoading: (state, action) => {
      const { key, isLoading } = action.payload;
      state.loading[key] = isLoading;
    },
    clearLoading: (state, action) => {
      const key = action.payload;
      delete state.loading[key];
    },
    clearAllLoading: (state) => {
      state.loading = {};
    },
    setNotificationSettings: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    setLayoutSettings: (state, action) => {
      state.layout = { ...state.layout, ...action.payload };
      localStorage.setItem('layoutSettings', JSON.stringify(state.layout));
    },
    setPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
      localStorage.setItem('uiPreferences', JSON.stringify(state.preferences));
    },
    resetUI: (state) => {
      state.sidebarOpen = true;
      state.sidebarCollapsed = false;
      state.mobileMenuOpen = false;
      state.modals = {};
      state.loading = {};
    },
    initializeUI: (state) => {
      // Load saved settings from localStorage
      const savedLayout = localStorage.getItem('layoutSettings');
      if (savedLayout) {
        try {
          state.layout = { ...state.layout, ...JSON.parse(savedLayout) };
        } catch (error) {
          console.error('Error parsing layout settings:', error);
        }
      }
      
      const savedPreferences = localStorage.getItem('uiPreferences');
      if (savedPreferences) {
        try {
          state.preferences = { ...state.preferences, ...JSON.parse(savedPreferences) };
        } catch (error) {
          console.error('Error parsing UI preferences:', error);
        }
      }
      
      // Check for reduced motion preference
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        state.layout.reducedMotion = true;
        state.layout.animation = false;
      }
      
      // Set initial sidebar state based on screen size
      if (window.innerWidth < 1024) {
        state.sidebarOpen = false;
        state.sidebarCollapsed = true;
      }
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setSidebarCollapsed,
  toggleSidebarCollapsed,
  setMobileMenuOpen,
  toggleMobileMenu,
  toggleCommandPalette,
  toggleNotificationPanel,
  openModal,
  closeModal,
  closeAllModals,
  setLoading,
  clearLoading,
  clearAllLoading,
  setNotificationSettings,
  setLayoutSettings,
  setPreferences,
  resetUI,
  initializeUI,
} = uiSlice.actions;

export default uiSlice.reducer;