import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { LandingPage } from './LandingPage'
import { Game } from './Game'

import { createBrowserRouter, RouterProvider, useParams } from 'react-router-dom'

const router = createBrowserRouter([{
  path: '/',
  Component: LandingPage,
}, {
  path: '/games/:id',
  Component: () => {
    const { id } = useParams()
    return <Game id={id ?? ''}/>
  }
},{
  path: '*',
  Component: () => <h1>Not found</h1>
}])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
