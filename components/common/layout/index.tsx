import Head from 'next/head'
import { ReactNode, useEffect, useState } from 'react'
import { getToken } from '../../../utils/auth'
import classNames from '../../../utils/classNames'
import Sidebar from './sidebar'

export default function Layout ({
  title = '',
  description = '',
  children
}: {
  title?: string
  description?: string
  children: ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only run on client side to prevent hydration mismatch
    const token = getToken()
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  // Don't render anything on server side or while loading
  if (isLoading) {
    return null
  }

  return (
    <>
      {isAuthenticated && (
        <div className={`font-satoshi relative bg-gradient-to-br from-white to-sky-50/100 h-screen mobile:h-full text-dark`}>
          <Head>
            {title && <title>{title}</title>}
            {description && <meta name='description' content={description} />}
            <link rel='icon' href='/favicon.ico' />
          </Head>

          <div className='relative w-full h-full flex justify-between'>
            <div className='relative md:w-62 tablet:w-2/12'>
              <Sidebar />
            </div>
            <div
              className={classNames(
                'w-5/6 ml-0 flex flex-col items-center justify-start overflow-auto mobile:pb-16 mobile:w-full mobile:h-auto h-[100vh]',
                'scrollbar-thin scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-track-white scrollbar-thumb-sky-200 scrollbar-h-1.5 mobile:scrollbar-h-1 scrollbar-w-1 mobile:scrollbar-w-1'
              )}
            >
              {children}
            </div>
          </div>
          {/* <Footer /> */}
        </div>
      )}
    </>
  )
}
