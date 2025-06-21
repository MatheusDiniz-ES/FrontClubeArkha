'use client'
import Sidebar from '@/components/Sidebar'
import { Navbar } from '@/components/Navbar'
import { useEffect, useState } from 'react'
import Footer from '@/components/Footer'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  })

  if (!isMounted) {
    return (
      <div className="flex w-full items-center justify-center">
        <svg className="animate-spin -ml-1 mr-3 h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={"4"}></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    )
  }

  return (
    <>
      <Sidebar />
      <div className="flex flex-1 flex-col bg-gray-100 dark:bg-gray-800">
        <Navbar />
        <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-100 dark:bg-gray-800">
          {children}
        </div>
        {/* <Footer/> */}
      </div>
    </>
  )
}
