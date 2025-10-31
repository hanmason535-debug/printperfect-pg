/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Vite Configuration - PrintPerfect-PG
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @fileoverview Vite build configuration for the PrintPerfect printing services website.
 * Configures React, TypeScript, path aliases, and optimized production bundling.
 * 
 * @description
 * - Enables React Fast Refresh for hot module replacement during development
 * - Configures path alias (@/) for clean imports throughout the project
 * - Implements intelligent code splitting for optimal loading performance
 * - Splits vendor libraries (React, UI components, Sanity CMS) into separate chunks
 * - Generates hidden source maps for production debugging without exposing source
 * - Uses Terser for production minification to reduce bundle size
 * 
 * @dependencies
 * - vite: Build tool and dev server
 * - @vitejs/plugin-react: React Fast Refresh and JSX support
 * - lovable-tagger: Development component inspection tool
 * 
 * @see {@link https://vitejs.dev/config/} Vite Configuration Reference
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// ─── Vite Configuration ──────────────────────────────────────────────────────

export default defineConfig(({ mode }) => ({
  // Base public path - can be overridden for subdirectory deployments
  base: process.env.VITE_PUBLIC_BASE || '/',
  
  // ─── Development Server ────────────────────────────────────────────────────
  server: {
    host: "::", // Listen on all network interfaces (IPv4 and IPv6)
    port: 8080, // Default development port
  },
  
  // ─── Plugins ───────────────────────────────────────────────────────────────
  plugins: [
    react(), // Enable React Fast Refresh and JSX transformation
    mode === 'development' && componentTagger(), // Component tagging for dev tools (dev only)
  ].filter(Boolean), // Remove falsy values (componentTagger in production)
  
  // ─── Module Resolution ─────────────────────────────────────────────────────
  resolve: {
    alias: {
      // "@" alias allows imports like "@/components/Header" instead of "../../components/Header"
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // ─── Build Optimization ────────────────────────────────────────────────────
  build: {
    // Rollup configuration for advanced bundling
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching and parallel loading
        manualChunks: {
          // React ecosystem - changes infrequently, cached longer
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI library components - large dependency set, loaded separately
          'ui-vendor': ['framer-motion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          
          // Sanity CMS dependencies - content fetching and image optimization
          'sanity-vendor': ['@sanity/client', '@sanity/image-url'],
        },
      },
    },
    
    // Increase chunk size warning limit (default is 500kb)
    // UI vendors may exceed 500kb due to Radix UI component library size
    chunkSizeWarningLimit: 1000,
    
    // Source map configuration
    // 'hidden' in production: generates maps for error tracking but doesn't expose in browser
    // true in development: full source maps for debugging
    sourcemap: mode === 'production' ? 'hidden' : true,
    
    // Minification strategy
    // Terser in production: better compression than esbuild, smaller final bundle
    // No minification in development: faster builds, easier debugging
    minify: mode === 'production' ? 'terser' : false,
  },
}));