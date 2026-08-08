import { use } from 'react';
import { ThemeContext } from '../contexts/ThemeContext/ThemeContext';

const useTheme = () => use(ThemeContext);

export default useTheme;
