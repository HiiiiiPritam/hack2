<<<<<<< HEAD
import { defineConfig } from 'vite'
import path from "path";
import react from '@vitejs/plugin-react'
=======
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
>>>>>>> 52dbccb7090215216fcac5f5fcfd3474187fff50

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
<<<<<<< HEAD
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
=======
      '@': path.resolve(__dirname, './src'),
    },
  },
});
>>>>>>> 52dbccb7090215216fcac5f5fcfd3474187fff50
