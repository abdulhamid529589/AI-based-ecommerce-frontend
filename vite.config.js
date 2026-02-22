import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Aggressive code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-state': ['react-redux', '@reduxjs/toolkit', 'redux'],
          'vendor-ui': ['lucide-react', 'react-toastify'],

          // Feature-based chunks
          'chunk-home': ['./src/pages/Home'],
          'chunk-products': [
            './src/pages/ProductsAmazonStyle',
            './src/pages/ProductDetailAmazonStyle',
          ],
          'chunk-auth': [
            './src/pages/Login',
            './src/pages/Register',
            './src/pages/ForgotPassword',
            './src/pages/ResetPassword',
          ],
          'chunk-checkout': ['./src/pages/Checkout', './src/pages/Cart', './src/pages/Payment'],
          'chunk-account': [
            './src/pages/UserProfile',
            './src/pages/Orders',
            './src/pages/Profile',
            './src/pages/Wishlist',
          ],
        },
      },
    },
    // Performance optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
  },
  // Optimization for development
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-redux',
      'redux',
      '@reduxjs/toolkit',
      'lucide-react',
      'react-toastify',
    ],
    exclude: ['node_modules'],
  },
})
