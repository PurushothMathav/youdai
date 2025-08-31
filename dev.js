// dev.js - Comprehensive Developer Tools Protection
// Detects and blocks dev tools even if already open or accessed via menu

class DevToolsProtection {
  constructor() {
    this.isDevToolsOpen = false;
    this.protectionActive = false;
    this.warningShown = false;
    this.detectionMethods = [];
    
    // Start protection immediately - we need to detect if dev tools are already open
    this.initImmediate();
  }

  initImmediate() {
    // Critical: Check if dev tools are already open when page loads
    this.detectExistingDevTools();
    
    // Set up all event listeners immediately
    this.disableAllDevToolsAccess();
    
    // Start continuous monitoring
    this.startContinuousDetection();
    
    // Additional setup when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupAdvancedProtection();
      });
    } else {
      this.setupAdvancedProtection();
    }
  }

  // Detect if dev tools are already open when page loads
  detectExistingDevTools() {
    // Method 1: Check window dimensions immediately
    const heightDiff = window.outerHeight - window.innerHeight;
    const widthDiff = window.outerWidth - window.innerWidth;
    
    if (heightDiff > 160 || widthDiff > 160) {
      this.handleDevToolsDetected();
      return;
    }

    // Method 2: Console detection trick
    let devtools = false;
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: function() {
        devtools = true;
        return 'devtools-detector';
      }
    });
    
    console.log(element);
    if (devtools) {
      this.handleDevToolsDetected();
    }

    // Method 3: Debugger detection
    const start = performance.now();
    debugger;
    const end = performance.now();
    
    if (end - start > 100) {
      this.handleDevToolsDetected();
    }
  }

  // Block ALL ways to access dev tools
  disableAllDevToolsAccess() {
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      let blocked = false;
      
      // F12
      if (e.key === 'F12') {
        blocked = true;
      }
      
      // Ctrl+Shift+I (Chrome DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        blocked = true;
      }
      
      // Ctrl+Shift+J (Chrome Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        blocked = true;
      }
      
      // Ctrl+Shift+C (Chrome Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        blocked = true;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        blocked = true;
      }
      
      // Ctrl+Shift+K (Firefox Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        blocked = true;
      }

      // Additional Firefox shortcuts
      if (e.ctrlKey && e.shiftKey && e.key === 'E') { // Firefox Network
        blocked = true;
      }

      if (e.ctrlKey && e.shiftKey && e.key === 'S') { // Firefox Debugger
        blocked = true;
      }

      // Safari shortcuts
      if (e.metaKey && e.altKey && e.key === 'I') { // Safari DevTools
        blocked = true;
      }

      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
        this.handleDevToolsDetected();
        return false;
      }
    }, true); // Use capture phase

    // Block right-click completely
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleDevToolsDetected();
      return false;
    }, true);

    // Block middle-click (sometimes used for inspect)
    document.addEventListener('mousedown', (e) => {
      if (e.button === 1) { // Middle mouse button
        e.preventDefault();
        return false;
      }
    }, true);
  }

  // Continuous detection using multiple methods
  startContinuousDetection() {
    // Method 1: Window size monitoring
    setInterval(() => {
      this.detectByWindowSize();
    }, 500);

    // Method 2: Console detection
    setInterval(() => {
      this.detectByConsole();
    }, 1000);

    // Method 3: Performance timing
    setInterval(() => {
      this.detectByTiming();
    }, 2000);

    // Method 4: Element inspector detection
    setInterval(() => {
      this.detectElementInspection();
    }, 1500);
  }

  detectByWindowSize() {
    const heightDiff = window.outerHeight - window.innerHeight;
    const widthDiff = window.outerWidth - window.innerWidth;
    
    // Lower threshold for more sensitive detection
    if (heightDiff > 150 || widthDiff > 150) {
      if (!this.isDevToolsOpen) {
        this.handleDevToolsDetected();
      }
    } else if (this.isDevToolsOpen && heightDiff < 100 && widthDiff < 100) {
      // Dev tools might be closed
      this.checkIfReallyClosed();
    }
  }

  detectByConsole() {
    let consoleOpened = false;
    
    // Create object with getter that detects access
    const detector = {};
    Object.defineProperty(detector, 'toString', {
      get: function() {
        consoleOpened = true;
        return '';
      }
    });
    
    console.log('%c', detector);
    
    if (consoleOpened && !this.isDevToolsOpen) {
      this.handleDevToolsDetected();
    }
  }

  detectByTiming() {
    const start = performance.now();
    debugger;
    const end = performance.now();
    
    if (end - start > 100 && !this.isDevToolsOpen) {
      this.handleDevToolsDetected();
    }
  }

  detectElementInspection() {
    // Detect if elements are being inspected
    const testElement = document.createElement('div');
    testElement.style.display = 'none';
    document.body.appendChild(testElement);
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.target === testElement) {
          this.handleDevToolsDetected();
        }
      });
    });
    
    observer.observe(testElement, { attributes: true });
    
    // Clean up after a while
    setTimeout(() => {
      observer.disconnect();
      if (testElement.parentNode) {
        testElement.remove();
      }
    }, 10000);
  }

  checkIfReallyClosed() {
    // Double-check if dev tools are really closed
    setTimeout(() => {
      const heightDiff = window.outerHeight - window.innerHeight;
      const widthDiff = window.outerWidth - window.innerWidth;
      
      if (heightDiff < 100 && widthDiff < 100) {
        this.deactivateProtection();
      }
    }, 1000);
  }

  setupAdvancedProtection() {
    // Monitor for common dev tool indicators
    this.monitorNetworkTab();
    this.preventInspection();
    this.blockCommonBypassMethods();
  }

  monitorNetworkTab() {
    // Detect if Network tab is being used
    const originalFetch = window.fetch;
    const originalXHR = window.XMLHttpRequest;
    
    window.fetch = function(...args) {
      // If dev tools are open, block network requests visibility
      if (window.devToolsProtection && window.devToolsProtection.isDevToolsOpen) {
        console.log('Network request blocked due to dev tools');
      }
      return originalFetch.apply(this, args);
    };
  }

  preventInspection() {
    // Prevent element inspection
    document.addEventListener('mousedown', (e) => {
      // Block Ctrl+Click (inspect element)
      if (e.ctrlKey) {
        e.preventDefault();
        this.handleDevToolsDetected();
        return false;
      }
    }, true);

    // Prevent selection that could lead to inspection
    document.addEventListener('selectstart', (e) => {
      if (this.protectionActive) {
        e.preventDefault();
        return false;
      }
    });
  }

  blockCommonBypassMethods() {
    // Block common bypass attempts
    
    // Disable iframe inspection
    window.addEventListener('message', (e) => {
      // Block postMessage that might be used for inspection
      if (this.protectionActive) {
        e.stopPropagation();
      }
    });

    // Monitor for suspicious global variables
    setInterval(() => {
      const suspiciousVars = ['$', '$$', '$x', 'inspect', 'monitor', 'debug'];
      suspiciousVars.forEach(varName => {
        if (window[varName] && typeof window[varName] === 'function') {
          this.handleDevToolsDetected();
        }
      });
    }, 2000);
  }

  activateProtection() {
    if (this.protectionActive) return;
    
    this.protectionActive = true;
    console.log('Full protection activated');
    
    // Apply comprehensive CSS restrictions
    document.body.classList.add('protection-active');
    
    // Start console spam
    this.startConsoleSpam();
    
    // Apply visual restrictions
    this.applyVisualRestrictions();
  }

  applyVisualRestrictions() {
    const style = document.createElement('style');
    style.id = 'active-protection-style';
    style.textContent = `
      .protection-active * {
        -webkit-touch-callout: none !important;
        -webkit-user-select: none !important;
        -khtml-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      }
      
      .protection-active img {
        pointer-events: none !important;
        -webkit-user-drag: none !important;
      }
      
      .protection-active iframe {
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  deactivateProtection() {
    this.protectionActive = false;
    this.isDevToolsOpen = false;
    
    // Remove restrictions
    document.body.classList.remove('protection-active');
    
    const activeStyle = document.getElementById('active-protection-style');
    if (activeStyle) {
      activeStyle.remove();
    }
    
    const overlay = document.getElementById('devtools-overlay');
    if (overlay) {
      overlay.remove();
    }
    
    // Clear console spam
    if (this.consoleSpamInterval) {
      clearInterval(this.consoleSpamInterval);
      this.consoleSpamInterval = null;
    }
    
    // Restore normal appearance
    document.body.style.filter = '';
    document.body.style.pointerEvents = '';
    document.body.style.opacity = '';
    
    console.log('Protection deactivated - dev tools closed');
  }

  startConsoleSpam() {
    if (this.consoleSpamInterval) return;
    
    this.consoleSpamInterval = setInterval(() => {
      if (!this.protectionActive) {
        clearInterval(this.consoleSpamInterval);
        this.consoleSpamInterval = null;
        return;
      }
      
      try {
        console.clear();
        console.log('%c🛡️ PROTECTED CONTENT', 'color: red; font-size: 40px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
        console.log('%cDeveloper tools detected and blocked.', 'color: orange; font-size: 18px; font-weight: bold;');
        console.log('%cClose developer tools to continue.', 'color: yellow; font-size: 16px;');
        console.log('%c' + '─'.repeat(50), 'color: red;');
        
        // Fill console with warnings
        for (let i = 0; i < 20; i++) {
          console.warn('Access Denied');
          console.error('Unauthorized Access Attempt');
        }
      } catch (e) {
        // Ignore errors
      }
    }, 100); // Very frequent to make console unusable
  }

  handleDevToolsDetected() {
    if (this.isDevToolsOpen) return;
    
    this.isDevToolsOpen = true;
    console.log('🚨 Developer tools detected!');
    
    this.activateProtection();
    this.showProtectionOverlay();
    
    // Apply immediate visual protection
    document.body.style.filter = 'blur(8px)';
    document.body.style.opacity = '0.3';
    document.body.style.pointerEvents = 'none';
    
    // More aggressive option: redirect after delay
    setTimeout(() => {
      if (this.isDevToolsOpen) {
        // Uncomment to redirect after 5 seconds
        // window.location.href = 'data:text/html,<h1 style="color:red;text-align:center;margin-top:100px;">Access Denied - Close Developer Tools</h1>';
      }
    }, 5000);
  }

  showProtectionOverlay() {
    const existing = document.getElementById('devtools-overlay');
    if (existing) return; // Don't create multiple overlays
    
    const overlay = document.createElement('div');
    overlay.id = 'devtools-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.95);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      text-align: center;
      padding: 20px;
      backdrop-filter: blur(20px);
      cursor: not-allowed;
    `;
    
    overlay.innerHTML = `
      <div style="max-width: 500px;">
        <div style="font-size: 80px; margin-bottom: 30px; animation: pulse 2s infinite;">🛡️</div>
        <h1 style="color: #ff4757; margin-bottom: 25px; font-size: 32px; font-weight: 700;">
          Developer Tools Detected
        </h1>
        <p style="font-size: 18px; margin-bottom: 20px; line-height: 1.6; opacity: 0.9;">
          This content is protected. Please close all developer tools to continue.
        </p>
        <p style="font-size: 14px; margin-bottom: 30px; opacity: 0.7;">
          This includes: F12, Right-click menu, Browser menu options, Console, Network tab, Elements tab
        </p>
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
          <button onclick="window.location.reload()" style="
            background: #4ecdc4;
            border: none;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
          " onmouseover="this.style.background='#45b7d1'" onmouseout="this.style.background='#4ecdc4'">
            Reload Page
          </button>
          <button onclick="window.close()" style="
            background: #ff6b6b;
            border: none;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
          " onmouseover="this.style.background='#ff5252'" onmouseout="this.style.background='#ff6b6b'">
            Close Tab
          </button>
        </div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      </style>
    `;
    
    document.body.appendChild(overlay);
    
    // Make overlay unclickable but prevent bypass
    overlay.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  setupAdvancedProtection() {
    // Comprehensive protection CSS
    const style = document.createElement('style');
    style.id = 'comprehensive-protection';
    style.textContent = `
      /* Disable all selection and interaction when protection is active */
      .protection-active {
        -webkit-touch-callout: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      
      .protection-active * {
        -webkit-user-drag: none !important;
        user-drag: none !important;
        -webkit-touch-callout: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      
      .protection-active img,
      .protection-active video,
      .protection-active iframe {
        pointer-events: none !important;
        -webkit-user-drag: none !important;
        user-drag: none !important;
      }

      /* Hide content on very small screens (dev tools open) */
      @media screen and (max-height: 300px) {
        body {
          opacity: 0.1 !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Additional event listeners
    this.setupAdvancedListeners();
  }

  setupAdvancedListeners() {
    // Detect drag attempts
    document.addEventListener('dragstart', (e) => {
      if (this.protectionActive || e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    });

    // Detect copy attempts
    document.addEventListener('copy', (e) => {
      if (this.protectionActive) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', 'Copying disabled');
        return false;
      }
    });

    // Block print
    window.addEventListener('beforeprint', (e) => {
      e.preventDefault();
      this.showWarning('Printing is disabled');
      return false;
    });

    // Detect PrintScreen
    document.addEventListener('keyup', (e) => {
      if (e.key === 'PrintScreen') {
        this.handleDevToolsDetected();
        try {
          navigator.clipboard.writeText('Screenshot blocked');
        } catch (err) {
          // Ignore
        }
      }
    });
  }

  showWarning(customMessage = 'Developer tools access is restricted') {
    if (this.warningShown) return;
    this.warningShown = true;
    
    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4757;
      color: white;
      padding: 15px 20px;
      border-radius: 12px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 8px 25px rgba(255, 71, 87, 0.3);
      font-weight: 600;
      font-size: 14px;
      max-width: 300px;
      animation: slideInRight 0.4s ease;
    `;
    
    warning.innerHTML = `🚫 ${customMessage}`;
    document.body.appendChild(warning);
    
    // Add animation
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(animationStyle);
    
    setTimeout(() => {
      if (warning.parentNode) {
        warning.style.animation = 'slideInRight 0.4s ease reverse';
        setTimeout(() => warning.remove(), 400);
      }
      this.warningShown = false;
      if (animationStyle.parentNode) {
        animationStyle.remove();
      }
    }, 4000);
  }
}

// Initialize protection immediately when script loads
(function() {
  'use strict';
  
  // Start protection right away
  window.devToolsProtection = new DevToolsProtection();
  
  console.log('🛡️ Site protection loaded');
})();