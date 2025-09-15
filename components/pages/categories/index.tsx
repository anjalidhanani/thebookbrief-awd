import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { CategoryInfo, getAllCategories } from '../../../api/categories'
import { setCategories } from '../../../store/main/actions'
import { GlobalState } from '../../../store/reducers'
import SubHeaderText from '../../common/SubHeaderText'
import DivLoader from '../../common/DivLoader'

export interface CustomCategoryInfo extends CategoryInfo {
  isSelected: boolean
  image: string
  books: number
}
interface CategoryPageProps {
  categories: CategoryInfo[]
}

const Category: React.FC<CategoryPageProps> = ({ categories }) => {
  const dispatch = useDispatch()

  const [categoriesList, setCategoriesList] = useState<CustomCategoryInfo[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = (item: CustomCategoryInfo) => {
    let arr = categoriesList?.map((ele: CustomCategoryInfo) => {
      if (ele.name === item.name) {
        return { ...ele, isSelected: !ele.isSelected }
      } else {
        return ele
      }
    })
    setCategoriesList(arr)
  }

  useEffect(() => {
    if (!categories) {
      setIsLoading(true)
      setError(null)
      getAllCategories()
        .then((data: any) => {
          if (data.success && data.data) {
            dispatch(setCategories(data.data))
          } else {
            setError('Failed to load categories')
          }
        })
        .catch((err: any) => {
          console.error('Error fetching categories:', err)
          setError('Failed to load categories. Please try again.')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setCategoriesList(() => {
        return categories.map((data: any) => {
          return { ...data, isSelected: data?.isSelected ?? false }
        })
      })
    }
  }, [categories, dispatch])


  return (
    <div className='flex flex-col items-start w-full mobile:px-3'>
      <SubHeaderText text='Explore all categories' className='p-10 pb-0 mobile:pl-3' />
      
      {isLoading && (
        <div className='w-full flex justify-center py-20'>
          <DivLoader className='w-12 h-12 border-b-sky-500 border-r-sky-500' />
        </div>
      )}
      
      {error && (
        <div className='w-full flex justify-center py-20'>
          <div className='text-center'>
            <p className='text-red-500 mb-4'>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className='px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors'
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {!isLoading && !error && categoriesList && (
        <div className='w-full p-10 mobile:p-3 tablet:px-10 tablet:pt-8 grid grid-cols-4 gap-10 tablet:grid-cols-3 mobile:grid-cols-2 mobile:gap-6'>
          {categoriesList?.map((data: CustomCategoryInfo, index: number) => {
            return (
              <a
                className={`relative items-center cursor-pointer h-40 gap-1.5 text-xl outline-none rounded-2xl mobile:text-sm overflow-hidden bg-black bg-opacity-90`}
                key={index}
                href={`/categories/${data?.name}`}
                onClick={() => handleClick(data)}
              >
                <div className='relative w-full h-full z-10 p-5 bg-black bg-opacity-70 text-center flex flex-col items-center justify-center'>
                  <p className='font-bold tablet:font-medium mobile:text-lg tablet:text-sm text-white opacity-80'>
                    {data?.name}
                  </p>
                  <div className="absolute bottom-2 right-2 opacity-80 flex gap-2">
                    <div
                      style={{
                        color: data?.color,
                      }}>
                      <span className={`fi ${data?.icon}`} />
                    </div>
                    <p
                      className='text-gray-100 text-xs flex items-center gap-1 rounded-full w-fit px-3'
                      style={{
                        color: data?.color,
                        backgroundColor: data?.color + '40'
                      }}>
                      {data?.books} books <ArrowUpRightIcon className='h-4' />
                    </p>
                  </div>
                </div>
                <img src={data?.image} alt={data?.name} className='absolute object-cover w-full h-full rounded-xl top-0 left-0' />
              </a>
            );
          })}
        </div>
      )}
    </div>
  )
}

const mapStateToPros = (state: GlobalState) => {
  return {
    categories: state.main.categories
  }
}

export default connect(mapStateToPros)(Category)
