import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { getBooksByCategory } from '../../../api/categories'
import { CategoryInfo } from '../../../api/categories'
import BookInfo from '../../common/BookInfo'
import DivLoader from '../../common/DivLoader'
import SubHeaderText from '../../common/SubHeaderText'
import GoBackButton from '../../common/GoBackButton'

export interface CustomCategoryInfo extends CategoryInfo {
  isSelected: boolean
  image: string
}

const BooksByCat: React.FC = () => {
  const router = useRouter()
  const categoryName = router.query.categoryName
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [books, setBooks] = useState([])
  const [count, setCount] = useState(0)

  const fetchBooksByCategories = (categoryName: string) => {
    setIsLoading(true)
    getBooksByCategory(categoryName)
      .then(data => {
        setBooks(data.data || [])
        setCount(data.data?.length || 0)
      })
      .catch(err => {
        console.log('Error fetching books by category:', err)
        setBooks([])
        setCount(0)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    if (categoryName) {
      fetchBooksByCategories(categoryName as string)
    }
  }, [categoryName])

  return (
    <>
      {categoryName &&
        <div className='w-full px-5 pt-6 mobile:px-3 mobile:pt-3 tablet:pt-8'>
          <div className='my-8 mobile:my-2 mx-2 flex gap-3 items-center'>
            <GoBackButton />
            <SubHeaderText text={categoryName as string} />
          </div>
          {books && books.length > 0 && (
            <div className='z-[10] grid grid-cols-5 tablet:grid-cols-3 gap-10 mobile:gap-3 mobile:grid-cols-2 mobile:w-full tablet:gap-3 w-full scrollbar-hide mb-6'>
              {books.map((data: any, index: number) => {
                return (
                  <div key={index} className='flex items-start justify-center w-full'>
                    <BookInfo data={data} />{' '}
                  </div>
                )
              })}
            </div>
          )}
          {isLoading && (
            <div className='w-full flex justify-center'>
              <DivLoader className='w-8 h-8 border-b-sky-500 border-r-sky-500' />
            </div>
          )}
          {!isLoading && books.length === 0 && (
            <div className='w-full flex justify-center'>
              <p className='text-gray-500 text-center'>No books found in this category.</p>
            </div>
          )}
        </div>}
    </>
  )
}

export default BooksByCat
