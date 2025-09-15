import {
  ArrowRightIcon,
  ClockIcon,
  PencilIcon,
  ShoppingCartIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
  getBookById,
  iBookInfo,
  iChapter
} from '../../../api/books'
import classNames from '../../../utils/classNames'
import { decode } from 'html-entities';
import DivLoader from '../../common/DivLoader'
import GoBackButton from '../../common/GoBackButton'


const Chapter: React.FC = () => {
  const router = useRouter()
  const { query } = router
  const { bookId } = query

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [bookData, setBookData] = useState<iBookInfo>()
  const [currentChapter, setCurrentChapter] = useState<iChapter>();

  const modifyAndSetBook = (data: any) => {
    const bookInfo = {
      ...data.data,
      chapter: [
        {
          id: 0,
          title: 'Description',
          text: data.data.aboutTheBook
        },
        ...data.data.chapter.map((ele: any, index: number) => {
          return { ...ele, id: index + 1 }
        })
      ]
    }
    setBookData(bookInfo)
    setCurrentChapter(bookInfo.chapter[0])
  }

  useEffect(() => {
    if (bookId && typeof bookId === 'string') {
      setIsLoading(true)
      getBookById(bookId)
        .then(data => {
          modifyAndSetBook(data)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => [setIsLoading(false)])
    }
  }, [bookId])

  const handleChangeChapter = (chapter: string) => {
    router.push("/book/" + bookData?.id + "/" + chapter)
  }

  return (
    <div className='relative flex flex-col items-start w-full'>
      <div className='w-full px-10 pt-10 pb-32 mobile:p-3 tablet:px-10 tablet:pt-8 overflow-y-auto scrollbar-hide'>
        <Head>
          {bookData && bookData.title && <title>{decode(bookData.title)}</title>}
          {bookData && bookData.aboutTheBook && (
            <meta name='description' content={decode(bookData.aboutTheBook)} />
          )}
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <GoBackButton />

        <div className='relative w-full flex justify-center'>
          <div
            className={classNames(
              'flex flex-col items-center justify-start mobile:pb-12 mobile:w-full mobile:h-auto mobile:px-6 mobile:pt-4 w-full'
            )}
          >
            {isLoading ? (
              <DivLoader className='w-6 h-6 border-b-sky-500 border-r-sky-500' />
            ) : (
              <div className='w-full flex flex-col items-center justify-between'>
                <div className='mobile:w-full tablet:w-full mobile:pb-7'>
                  <div className='w-full flex mobile:flex-col gap-12 m-14 mobile:m-0 mobile:mt-16 tablet:py-10'>
                    <div className='mobile:w-full w-40 flex mobile:items-center items-start justify-center'>
                      <img
                        className='object-contain rounded-xl mobile:rounded-lg tablet:rounded-lg'
                        src={bookData?.imageUrl}
                        alt={bookData?.title}
                      />
                    </div>
                    <div className='w-4/6 mobile:w-full'>
                      <h1 className='text-4xl mobile:text-2xl text-sky-500 font-bold'>
                        {decode(bookData?.title)}
                      </h1>
                      <p className='text-lg mobile:text-md text-sky-500 font-thin italic my-4'>
                        {decode(bookData?.subtitle)}
                      </p>
                      <div className='flex flex-col w-full gap-3 mt-6  text-gray-500'>
                        <div className='text-sm flex gap-2'>
                          <PencilIcon className='w-5 h-5 text-sky-500' />
                          {decode(bookData?.author)}
                        </div>
                        <div className='text-sm flex gap-2'>
                          <StarIcon className='w-5 h-5 text-sky-500' />
                          {bookData?.rating}
                        </div>
                        <div className='text-sm flex gap-2'>
                          <ClockIcon className='w-5 h-5 text-sky-500' />
                          {bookData?.readingTime} Minutes
                        </div>
                      </div>
                    </div>
                  </div>
                  {currentChapter &&
                    <div className='w-full mobile:px-0'>
                      <div className='flex flex-col w-full items-center justify-center tablet:pl-14 tablet:pr-8'>
                        <div
                          className='indent-14 text-lg mobile:text-md mobile:my-10 tablet:w-full text-gray-500 whitespace-pre-line tablet:mt-5 w-7/12 mobile:w-full'
                          dangerouslySetInnerHTML={{ __html: decode(currentChapter.text) }}
                        ></div>
                      </div>
                    </div>}
                  <div className='w-full flex items-center justify-center mobile:w-full pt-10 mobile:pt-6 tablet:pt-8 mobile:p-0 tablet:px-10 tablet:w-full'>
                    <div className='w-1/2 mobile:w-full tablet:w-full flex flex-col gap-3 mobile:gap-5'>
                      <div className='w-full flex items-center justify-end'>
                        <div
                          className='cursor-pointer w-full flex outline-none items-center justify-end text-sky-500 hover:underline'
                          onClick={() => {
                            const changeTo = bookData?.chapter.find(
                              data => data.id === (currentChapter?.id ?? 0) + 1
                            )
                            handleChangeChapter(changeTo?.id.toString() ?? "Introduction")
                          }}
                        >
                          {currentChapter &&
                            currentChapter?.id + 1 <
                            (bookData?.chapter?.length ?? 0) && (
                              <>
                                <span className='w-3/4 mobile:w-full line-clamp-1 text-right'>
                                  {'#' + (currentChapter?.id + 1)}{' '}
                                  {bookData?.chapter[currentChapter.id + 1]
                                    .title ?? 'Next'}
                                </span>
                                <ArrowRightIcon className='w-5 h-5' />
                              </>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chapter