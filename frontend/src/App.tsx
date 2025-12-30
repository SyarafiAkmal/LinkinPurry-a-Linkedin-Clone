import './App.css'
import { Outlet } from 'react-router-dom'
import Layout from '@/components/Layout/Layout'
import { Suspense } from 'react'
import { Toaster } from "react-hot-toast"
import Chat from './components/Chat/Chat'

function App() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
      <Toaster position='bottom-left'/>
      <Chat />
    </Layout>
  )
}

export default App
