import { useTranslation } from 'react-i18next';
import { useRTL } from '../contexts/RTLContext';

/**
 * Custom hook that combines translation with RTL utilities
 * Provides easy access to translations and RTL-aware styling helpers
 */
export function useAppTranslation() {
  const { t, i18n } = useTranslation();
  const { isRTL, direction, currentLanguage, setLanguage, toggleLanguage } = useRTL();

  // RTL-aware class utilities
  const rtlClass = (ltrClass: string, rtlClassOverride?: string) => {
    if (!isRTL) return ltrClass;
    return rtlClassOverride || ltrClass;
  };

  // Flip direction-specific classes for RTL
  const flipClass = (className: string) => {
    if (!isRTL) return className;
    
    // Map LTR classes to RTL equivalents
    const flipMap: Record<string, string> = {
      'left': 'right',
      'right': 'left',
      'ml-': 'mr-',
      'mr-': 'ml-',
      'pl-': 'pr-',
      'pr-': 'pl-',
      'text-left': 'text-right',
      'text-right': 'text-left',
      'border-l': 'border-r',
      'border-r': 'border-l',
      'rounded-l': 'rounded-r',
      'rounded-r': 'rounded-l',
      '-left-': '-right-',
      '-right-': '-left-',
      'left-': 'right-',
      'right-': 'left-',
    };

    let result = className;
    for (const [ltr, rtl] of Object.entries(flipMap)) {
      if (result.includes(ltr)) {
        result = result.replace(new RegExp(ltr, 'g'), rtl);
      }
    }
    return result;
  };

  // Get flex direction class based on RTL
  const flexDir = (defaultDir: 'row' | 'row-reverse' | 'col' | 'col-reverse' = 'row') => {
    if (!isRTL) return `flex-${defaultDir}`;
    
    if (defaultDir === 'row') return 'flex-row-reverse';
    if (defaultDir === 'row-reverse') return 'flex-row';
    return `flex-${defaultDir}`;
  };

  // Get text alignment based on RTL
  const textAlign = (defaultAlign: 'left' | 'right' | 'center' = 'left') => {
    if (defaultAlign === 'center') return 'text-center';
    if (!isRTL) return `text-${defaultAlign}`;
    return defaultAlign === 'left' ? 'text-right' : 'text-left';
  };

  // Icon rotation for directional icons (arrows, etc.)
  const iconRotation = (shouldFlip: boolean = true) => {
    return isRTL && shouldFlip ? 'transform rotate-180' : '';
  };

  // Get start/end margin/padding based on RTL
  const spacing = {
    ms: (size: string) => isRTL ? `mr-${size}` : `ml-${size}`, // margin-start
    me: (size: string) => isRTL ? `ml-${size}` : `mr-${size}`, // margin-end
    ps: (size: string) => isRTL ? `pr-${size}` : `pl-${size}`, // padding-start
    pe: (size: string) => isRTL ? `pl-${size}` : `pr-${size}`, // padding-end
  };

  // Format numbers for Arabic locale
  const formatNumber = (num: number) => {
    if (currentLanguage === 'ar') {
      return num.toLocaleString('ar-EG');
    }
    return num.toLocaleString('en-US');
  };

  // Format date for current locale
  const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const locale = currentLanguage === 'ar' ? 'ar-EG' : 'en-US';
    const defaultOptions: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      ...options
    };
    return d.toLocaleDateString(locale, defaultOptions);
  };

  // Format percentage
  const formatPercent = (value: number) => {
    if (currentLanguage === 'ar') {
      return `${value.toLocaleString('ar-EG')}٪`;
    }
    return `${value}%`;
  };

  return {
    t,
    i18n,
    isRTL,
    direction,
    currentLanguage,
    setLanguage,
    toggleLanguage,
    rtlClass,
    flipClass,
    flexDir,
    textAlign,
    iconRotation,
    spacing,
    formatNumber,
    formatDate,
    formatPercent,
  };
}

export default useAppTranslation;
