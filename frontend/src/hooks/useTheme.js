import { useSelector, useDispatch } from 'react-redux';
import { setTheme, toggleTheme } from '../store/slices/uiSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  const setCurrentTheme = (newTheme) => {
    dispatch(setTheme(newTheme));
  };

  const toggleCurrentTheme = () => {
    dispatch(toggleTheme());
  };

  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  return {
    theme,
    isDark,
    isLight,
    setTheme: setCurrentTheme,
    toggleTheme: toggleCurrentTheme,
  };
};