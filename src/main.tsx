import './index.css'

import React, { FC } from 'react'
import ReactDOM from 'react-dom/client'

import { LandingPage } from './LandingPage'
import { Game } from './Game'

import { createBrowserRouter, Outlet, RouterProvider, useParams } from 'react-router-dom'
import { PreviousPageProvider } from './components/PreviousPage'

const Root: FC = () => {

  return (
    <PreviousPageProvider>
      <Outlet/>
    </PreviousPageProvider>
  )
}

const router = createBrowserRouter([{
  path: '/',
  element: <Root/>,
  errorElement: <h1>Not found</h1>,
  children: [{
    path: '/',
    element: <LandingPage/>,
  }, {
    path: '/games/:id',
    Component: () => {
      const { id } = useParams()
      return <Game id={id ?? ''}/>
    }
  }]
}])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
