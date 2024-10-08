import '@mantine/core/styles.css';
import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppShell, MantineProvider } from '@mantine/core';

import { App } from './App.tsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([{
  path: '/',
  Component: App,
}, {
  path: '*',
  Component: () => <h1>Not found</h1>
}])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider>
      <AppShell padding='md'>
        <RouterProvider router={router} />
      </AppShell>
    </MantineProvider>
  </React.StrictMode>,
)
