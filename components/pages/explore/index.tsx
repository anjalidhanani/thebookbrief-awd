import {
  ChevronDownIcon
} from '@heroicons/react/20/solid'
import {
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { getAllFreeBooks, getBooksByKeyword } from '../../../api/books'
import { CategoryInfo } from '../../../api/categories'
import { GlobalState } from '../../../store/reducers'
import BookInfo from '../../common/BookInfo'
import DivLoader from '../../common/DivLoader'
import SubHeaderText from '../../common/SubHeaderText'

export interface CustomCategoryInfo extends CategoryInfo {
  isSelected: boolean
}
interface CategoryPageProps {
  categories: CategoryInfo[]
}

const Explore: React.FC<CategoryPageProps> = ({ categories }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [timeoutId, setTimeoutId] = useState<any>(null)
  const [books, setBooks] = useState<any[]>([])
  const [count, setCount] = useState<number>(0)

  const fetchBooksByCategories = (data: { page: number, keyword: string }, appendMode: boolean = false) => {
    setIsLoading(true)
    data = { ...data, page: appendMode ? books.length : 0 }
    getBooksByKeyword(data)
      .then(data => {
        setBooks(preVal => {
          return appendMode ? preVal.concat(data.data) : data.data
        })
        setCount(data.count)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const getInputs = () => {
    const input = {
      page: books.length,
      keyword: inputValue,
    }
    return input
  }

  const handleInputChange = () => {
    setIsLoading(true)
    setBooks([])
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    setTimeoutId(
      setTimeout(() => {
        const input = getInputs()
        if (input.keyword) {
          fetchBooksByCategories(input)
          setIsLoading(false)
        }
      }, 2000)
    )
  }

  useEffect(() => {
    if (inputValue === '') {
      setBooks([])
    } else {
      handleInputChange()
    }
  }, [inputValue])


  return (
    <div className='flex flex-col items-start w-full'>
      <div className='w-full px-10 pt-10 mobile:p-3 tablet:px-10 tablet:pt-8'>
        <div className='relative flex items-center justify-end w-full mobile:w-full tablet:w-full gap-5'>
          <div className='relative flex items-center w-2/6 mobile:w-full tablet:w-full'>
            <input
              className='w-full rounded-full p-3 pl-12 text-gray-600 bg-white focus:ring-2 focus:ring-sky-200 outline-none shadow-lg shadow-gray-100 placeholder:text-gray-300'
              placeholder='Find the book you like...'
              value={inputValue}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  fetchBooksByCategories(getInputs())
                }
              }
              }
              onChange={e => {
                setInputValue(e.target.value)
              }}
            />
            <MagnifyingGlassIcon className='text-gray-400 w-6 h-6 absolute left-3' />
          </div>
        </div>
        {isLoading && (<>
          <DivLoader className='w-10 h-10 border-b-sky-500 border-r-sky-500' />
        </>)}
        {(books && inputValue) ? (
          <>
            {!isLoading && books.length === 0 ? (
              <NoBook />
            ) : (
              <>
                <p>Results for "{inputValue}"</p>
                {books && books.length > 0 && (
                  <div className='z-[10] grid grid-cols-5 tablet:grid-cols-3 gap-10 mobile:gap-3 mobile:grid-cols-2 mobile:w-full tablet:gap-3 w-full scrollbar-hide my-6'>
                    {books &&
                      books.length > 0 &&
                      books.map((data: any, index: number) => {
                        return (
                          <div key={index} className='flex items-start justify-center w-full'>
                            <BookInfo data={data} />{' '}
                          </div>
                        )
                      })}
                  </div>
                )}
              </>
            )}
            {!isLoading && count > books.length &&
              <div className='w-full flex justify-center'>
                <button
                  className='flex items-center p-1.5 px-5 rounded-full bg-sky-500 ring-0 outline-none text-white mb-4 whitespace-nowrap gap-1.5'
                  onClick={() => { fetchBooksByCategories(getInputs(), true) }}
                >
                  Load more
                  {isLoading ? (
                    <DivLoader className='w-4 h-4 border-b-white border-r-white' />
                  ) : (
                    <ChevronDownIcon className='w-6 h-6' />
                  )}
                </button>
              </div>}
          </>
        ) :
          <PopularBooks />
        }
      </div>
    </div>
  )
}

const mapStateToPros = (state: GlobalState) => {
  return {
    categories: state.main.categories
  }
}

export default connect(mapStateToPros)(Explore)

const NoBook = React.memo(() => {
  return (
    <div className='text-lg w-full flex flex-col items-center my-5'>
      <Image
        className='mt-5'
        src='images/no_data.svg'
        alt='book_love'
        height={120}
        width={120}
      />
      <p className='text-lg w-2/6 mobile:w-1/2 text-center mt-4 text-light'>
        No books found for this category, Please select different category
      </p>
    </div>
  )
})

export const PopularBooks = React.memo(() => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [defaultBooks, setDefaultBooks] = useState([])
  const [hasMoreBooks, setHasMoreBooks] = useState<boolean>(true)

  const fetchBooks = (appendMode: boolean = false) => {
    setIsLoading(true)
    getAllFreeBooks(appendMode ? defaultBooks.length : 0)
      .then(data => {
        setDefaultBooks((preval: any) => {
          return appendMode ? preval.concat(data.data) : data.data
        })
        // Update hasMoreBooks based on pagination data
        if (data.pagination) {
          setHasMoreBooks(data.pagination.hasMore)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  return (
    <div className='w-full px-5 pt-6 mobile:px-3 mobile:pt-3 tablet:px-0 tablet:pt-8'>
      <div className='mb-3 mobile:my-2 mx-2'>
        <SubHeaderText text='Most Popular' />
      </div>
      {defaultBooks && defaultBooks.length > 0 && (
        <div className='z-[10] grid grid-cols-5 tablet:grid-cols-3 gap-10 mobile:gap-3 mobile:grid-cols-2 mobile:w-full tablet:gap-3 w-full scrollbar-hide mb-6'>
          {defaultBooks &&
            defaultBooks.length > 0 &&
            defaultBooks.map((data: any, index: number) => {
              return (
                <div key={index} className='flex items-start justify-center w-full'>
                  <BookInfo data={data} />{' '}
                </div>
              )
            })}
        </div>
      )}
      {hasMoreBooks && (
        <div className='w-full flex justify-center'>
          <button
            className='flex items-center p-1.5 px-5 rounded-full bg-sky-500 ring-0 outline-none text-white mb-4 whitespace-nowrap gap-1.5'
            onClick={() => fetchBooks(true)}
            disabled={isLoading}
          >
            Load more
            {isLoading ? (
              <DivLoader className='w-4 h-4 border-b-white border-r-white' />
            ) : (
              <ChevronDownIcon className='w-6 h-6' />
            )}
          </button>
        </div>
      )}
    </div>
  )
})