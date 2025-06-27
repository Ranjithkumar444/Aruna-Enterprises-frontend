// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        // Custom colors to preserve original palette
        'blue-900': '#14315a',      // For main title
        'purple-700': '#9023d8',    // For column titles

        // Colors for status dots and card borders, mapped from original CSS
        'status-blue': '#2563eb',   // Corresponds to original .border-blue, .dot-blue
        'status-yellow': '#eab308', // Corresponds to original .border-yellow, .dot-yellow
        'status-green': '#10b981',  // Corresponds to original .border-green, .dot-green
        // For SHIPPED, mapping to the purple from original .dot-purple and .border-purple
        'status-purple': '#9b59b6', // Corresponds to original .dot-purple, .border-purple
      },
      animation: {
        // Ensure existing animations are present
        'scroll-left': 'scroll-left 35s linear infinite', 
        'pulse-light': 'pulse-light 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'expand-line': 'expand-line 0.8s ease-out forwards',
        'blob': 'blob 7s infinite',
        'blob-pulse': 'blob-pulse 10s infinite cubic-bezier(0.4, 0, 0.6, 1)',
        'fade-in-scale': 'fadeInScale 1s ease-out forwards',
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'fade-in-up-slow': 'fadeInUp 1.5s ease-out forwards',
        'fade-in-left': 'fadeInLeft 1s ease-out forwards',
        'fade-in-right': 'fadeInRight 1s ease-out forwards',
        'fade-in-down': 'fadeInDown 1s ease-out forwards',
        

        // NEW: Modal specific fade-in animation
        'modal-fade-in': 'modalFadeIn 0.3s ease-in-out',
      },
      keyframes: {
        // Ensure existing keyframes are present
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-light': {
           '0%, 100%': { opacity: '1', transform: 'scaleX(1)' },
           '50%': { opacity: '0.7', transform: 'scaleX(1.05)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'expand-line': {
          '0%': { transform: 'scaleX(0)', opacity: '0' },
          '100%': { transform: 'scaleX(1)', opacity: '1' },
        },
        'blob': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        'blob-pulse': {
           '0%, 100%': { transform: 'scale(1)', opacity: '0.4' },
           '50%': { transform: 'scale(1.05)', opacity: '0.6' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },

        // NEW: Keyframe for modal fade-in
        modalFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};