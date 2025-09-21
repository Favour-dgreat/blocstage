import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SessionManagerOptions {
  warningTime?: number; // Time in minutes before expiry to show warning
  sessionDuration?: number; // Total session duration in minutes
  refreshThreshold?: number; // Time in minutes before expiry to refresh session
  checkInterval?: number; // How often to check session (in seconds)
}

interface SessionWarningModalProps {
  isOpen: boolean;
  onExtend: () => void;
  onLogout: () => void;
  timeRemaining: number;
}

const DEFAULT_OPTIONS: Required<SessionManagerOptions> = {
  warningTime: 5, // Show warning 5 minutes before expiry
  sessionDuration: 30, // 30 minutes total session
  refreshThreshold: 10, // Refresh when 10 minutes remaining
  checkInterval: 30, // Check every 30 seconds
};

export const useSessionManager = (options: SessionManagerOptions = {}) => {
  const router = useRouter();
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(true);
  
  const sessionStartTime = useRef<number | null>(null);
  const lastActivityTime = useRef<number>(Date.now());
  const warningShown = useRef(false);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate time remaining in session
  const calculateTimeRemaining = useCallback(() => {
    if (!sessionStartTime.current) return 0;
    
    const now = Date.now();
    const sessionElapsed = (now - sessionStartTime.current) / (1000 * 60); // Convert to minutes
    const remaining = Math.max(0, config.sessionDuration - sessionElapsed);
    
    return Math.floor(remaining);
  }, [config.sessionDuration]);

  // Check if session should be refreshed
  const shouldRefreshSession = useCallback(() => {
    const remaining = calculateTimeRemaining();
    return remaining <= config.refreshThreshold && remaining > 0;
  }, [calculateTimeRemaining, config.refreshThreshold]);

  // Check if warning should be shown
  const shouldShowWarning = useCallback(() => {
    const remaining = calculateTimeRemaining();
    return remaining <= config.warningTime && remaining > 0 && !warningShown.current;
  }, [calculateTimeRemaining, config.warningTime]);

  // Refresh session by calling API
  const refreshSession = useCallback(async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No auth token found');
      }

      // Call refresh endpoint (you may need to adjust this based on your API)
      const response = await fetch('https://api.blocstage.com/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        // Reset session timer
        sessionStartTime.current = Date.now();
        lastActivityTime.current = Date.now();
        warningShown.current = false;
        setIsWarningVisible(false);
        
        console.log('Session refreshed successfully');
        return true;
      } else {
        throw new Error('Failed to refresh session');
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      return false;
    }
  }, []);

  // Logout user and redirect to login
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    sessionStartTime.current = null;
    lastActivityTime.current = Date.now();
    warningShown.current = false;
    setIsWarningVisible(false);
    setIsSessionActive(false);
    
    // Show logout message
    alert('Your session has expired. Please log in again.');
    
    // Redirect to login page
    router.push('/login');
  }, [router]);

  // Extend session (user clicked extend in warning modal)
  const extendSession = useCallback(async () => {
    const success = await refreshSession();
    if (success) {
      setIsWarningVisible(false);
      warningShown.current = false;
    } else {
      // If refresh fails, logout
      logout();
    }
  }, [refreshSession, logout]);

  // Handle user activity
  const handleUserActivity = useCallback(() => {
    lastActivityTime.current = Date.now();
    
    // If session is about to expire and user is active, try to refresh
    if (shouldRefreshSession()) {
      refreshSession();
    }
  }, [shouldRefreshSession, refreshSession]);

  // Main session check function
  const checkSession = useCallback(() => {
    const remaining = calculateTimeRemaining();
    setTimeRemaining(remaining);

    if (remaining <= 0) {
      // Session expired
      logout();
      return;
    }

    if (shouldShowWarning()) {
      setIsWarningVisible(true);
      warningShown.current = true;
    }
  }, [calculateTimeRemaining, shouldShowWarning, logout]);

  // Initialize session
  const initializeSession = useCallback(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      sessionStartTime.current = Date.now();
      lastActivityTime.current = Date.now();
      setIsSessionActive(true);
      warningShown.current = false;
      setIsWarningVisible(false);
    } else {
      setIsSessionActive(false);
    }
  }, []);

  // Set up event listeners for user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const throttledHandleActivity = throttle(handleUserActivity, 30000); // Throttle to every 30 seconds
    
    events.forEach(event => {
      document.addEventListener(event, throttledHandleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, throttledHandleActivity, true);
      });
    };
  }, [handleUserActivity]);

  // Set up session checking interval
  useEffect(() => {
    if (!isSessionActive) return;

    checkIntervalRef.current = setInterval(checkSession, config.checkInterval * 1000);
    
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [isSessionActive, checkSession, config.checkInterval]);

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  return {
    isWarningVisible,
    timeRemaining,
    isSessionActive,
    extendSession,
    logout,
    refreshSession,
  };
};

// Throttle function to limit how often activity handler runs
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Export the interface for use in other components
export type { SessionWarningModalProps };
