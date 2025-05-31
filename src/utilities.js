// Copy this to a file named authDebug.js to help diagnose token issues

/**
 * Utility functions for debugging authentication and token issues
 */

/**
 * Logs the current authentication state to the console
 * Helps diagnose login issues
 */
export function debugAuthState() {
  console.group('🔐 Authentication Debug');
  
  // Check localStorage token
  const token = localStorage.getItem('token');
  console.log('localStorage token:', token ? '✅ EXISTS' : '❌ MISSING');
  
  // If token exists, check its format
  if (token) {
    if (token.split('.').length === 3) {
      console.log('Token format: ✅ Appears to be a valid JWT (has 3 parts)');
      
      try {
        // Try to decode the JWT payload
        const payload = parseJwt(token);
        console.log('Token payload:', payload);
        
        // Check expiration
        if (payload && payload.exp) {
          const now = Math.floor(Date.now() / 1000);
          const expiresIn = payload.exp - now;
          
          if (expiresIn > 0) {
            console.log(`Token expiration: ✅ Valid (expires in ${formatTime(expiresIn)})`);
          } else {
            console.log(`Token expiration: ❌ EXPIRED (${formatTime(Math.abs(expiresIn))} ago)`);
          }
        } else {
          console.log('Token expiration: ⚠️ No expiration claim found');
        }
      } catch (e) {
        console.log('Token decoding: ❌ Failed to decode token payload');
      }
    } else {
      console.log('Token format: ⚠️ Does not appear to be a standard JWT');
    }
  }
  
  // Check sessionStorage
  const sessionCheck = sessionStorage.getItem('is_check_usr');
  console.log('sessionStorage check:', sessionCheck ? '✅ EXISTS' : '❌ MISSING');
  
  // List all localStorage items (to find any other tokens)
  console.log('All localStorage items:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    const valuePreview = value && value.length > 30 ? `${value.substring(0, 30)}...` : value;
    console.log(` - ${key}: ${valuePreview}`);
  }
  
  // List all cookies
  console.log('Cookies:');
  document.cookie.split(';').forEach(cookie => {
    if (cookie.trim()) {
      console.log(` - ${cookie.trim()}`);
    }
  });
  
  console.groupEnd();
  
  return !!token;
}

/**
 * Parses a JWT token to extract its payload
 * @param {string} token - The JWT token
 * @returns {object|null} The parsed payload or null if invalid
 */
export function parseJwt(token) {
  try {
    if (!token) return null;
    
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT:', e);
    return null;
  }
}

/**
 * Formats seconds into a human-readable time string
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds} seconds`;
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)} minutes`;
  } else if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)} hours`;
  } else {
    return `${Math.floor(seconds / 86400)} days`;
  }
}

/**
 * Sets up global functions for debugging in the console
 * Use this in development environments only
 */
export function setupGlobalDebugFunctions() {
  // Make functions available in the global scope for console debugging
  window.debugAuthState = debugAuthState;
  window.parseJwt = parseJwt;
  
  // Function to clear all authentication data
  window.clearAllAuth = function() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('is_check_usr');
    
    // Clear any auth cookies
    document.cookie.split(';').forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    console.log('🧹 All authentication data cleared');
    debugAuthState();
  };
  
  // Function to fix token issues
  window.fixTokenIssues = function() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('❌ No token found in localStorage to fix');
      return;
    }
    
    // Ensure token is also in sessionStorage if needed
    sessionStorage.setItem('is_check_usr', 'true');
    
    console.log('🔧 Basic token fixes applied');
    debugAuthState();
  };
  
  console.log('🛠️ Auth debugging tools added to window object. Available commands:');
  console.log('• debugAuthState() - Show current auth state');
  console.log('• clearAllAuth() - Clear all auth data');
  console.log('• fixTokenIssues() - Attempt to fix common token issues');
  console.log('• parseJwt(token) - Parse a JWT token');
}

/**
 * Intercepts and logs all token-related localStorage operations
 * Use this to track where tokens are being set or removed
 */
export function monitorTokenStorage() {
  // Store original methods
  const originalSetItem = localStorage.setItem;
  const originalRemoveItem = localStorage.removeItem;
  const originalClear = localStorage.clear;
  
  // Override setItem
  localStorage.setItem = function(key, value) {
    if (key === 'token') {
      console.log(`%c📝 localStorage.setItem('token', '${value.substring(0, 20)}...')`, 'color: green; font-weight: bold');
      console.trace('Token set by:');
    }
    return originalSetItem.call(localStorage, key, value);
  };
  
  // Override removeItem
  localStorage.removeItem = function(key) {
    if (key === 'token') {
      console.log(`%c🗑️ localStorage.removeItem('token')`, 'color: red; font-weight: bold');
      console.trace('Token removed by:');
    }
    return originalRemoveItem.call(localStorage, key);
  };
  
  // Override clear
  localStorage.clear = function() {
    console.log(`%c🧹 localStorage.clear()`, 'color: orange; font-weight: bold');
    console.trace('localStorage cleared by:');
    return originalClear.call(localStorage);
  };
  
  console.log('🔍 Token storage monitoring enabled');
}

/**
 * Use this function to diagnose and fix token issues
 */
export function diagnoseTokenIssues() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('❌ No token in localStorage');
    return {
      exists: false,
      valid: false,
      expired: true,
      issues: ['Token missing from localStorage']
    };
  }
  
  const issues = [];
  let valid = false;
  let expired = true;
  
  // Check token format
  if (token.split('.').length !== 3) {
    issues.push('Token format is invalid (not a standard JWT)');
  } else {
    try {
      // Try to decode the JWT payload
      const payload = parseJwt(token);
      
      if (payload) {
        valid = true;
        
        // Check expiration
        if (payload.exp) {
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp > now) {
            expired = false;
          } else {
            issues.push(`Token expired ${formatTime(now - payload.exp)} ago`);
          }
        } else {
          issues.push('Token has no expiration claim');
        }
      } else {
        issues.push('Failed to decode token payload');
      }
    } catch (e) {
      issues.push('Error parsing token: ' + e.message);
    }
  }
  
  // Check if session storage has check flag
  if (!sessionStorage.getItem('is_check_usr')) {
    issues.push('Missing session check flag in sessionStorage');
  }
  
  return {
    exists: true,
    valid,
    expired,
    issues,
    token: token.substring(0, 10) + '...' // Preview only
  };
}

/**
 * Call this when logging in to verify token was properly set
 */
export function verifyLoginSuccessful(expectedToken) {
  const storedToken = localStorage.getItem('token');
  
  console.group('🔑 Login Verification');
  
  if (!storedToken) {
    console.error('❌ Login failed: Token not saved to localStorage');
    console.groupEnd();
    return false;
  }
  
  if (expectedToken && storedToken !== expectedToken) {
    console.warn('⚠️ Token mismatch: Stored token different from expected token');
  } else {
    console.log('✅ Token successfully saved to localStorage');
  }
  
  const sessionCheck = sessionStorage.getItem('is_check_usr');
  if (!sessionCheck) {
    console.warn('⚠️ Session check flag not set in sessionStorage');
  } else {
    console.log('✅ Session check flag set in sessionStorage');
  }
  
  // Validate token format
  try {
    const payload = parseJwt(storedToken);
    if (payload) {
      console.log('✅ Token successfully decoded:', payload);
      
      // Check expiration
      if (payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        const expiresIn = payload.exp - now;
        
        if (expiresIn > 0) {
          console.log(`✅ Token valid for ${formatTime(expiresIn)}`);
        } else {
          console.error(`❌ Token already expired ${formatTime(Math.abs(expiresIn))} ago`);
        }
      } else {
        console.warn('⚠️ Token has no expiration claim');
      }
    } else {
      console.error('❌ Could not decode token payload');
    }
  } catch (e) {
    console.error('❌ Error parsing token:', e);
  }
  
  console.groupEnd();
  return true;
}