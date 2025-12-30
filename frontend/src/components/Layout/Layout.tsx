import React from "react"
import Navbar from "./Navbar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return(
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-[#f4f2ee]">
        <div className="py-4 px-2 xl:mx-40">{children}</div>
      </main>
    </div>
  )
}