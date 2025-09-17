import {
  ArrowLeftIcon,
  ArrowRightIcon
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
import { INTRODUCTION_CHAPTER } from '../../../utils/consts'
import extractTextFromHtml from '../../../utils/extractTextFromHtml'
import DivLoader from '../../common/DivLoader'
import GoBackButton from '../../common/GoBackButton'
import AddToListButton from '../../common/AddToListButton'
import { decode } from 'html-entities'
import { connect } from 'react-redux'
import { GlobalState } from '../../../store/reducers'
import { UserInfo } from '../../../api/users'

let regex = /<\w+\s*>\s*<\/\w+\s*>/g;

interface ChapterProps {
  userInfo: UserInfo;
}

const Chapter: React.FC<ChapterProps> = ({ userInfo }) => {
  const router = useRouter()
  const { query } = router
  const { bookId, chapter } = query

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [bookData, setBookData] = useState<iBookInfo>()
  const [currentChapter, setCurrentChapter] = useState<iChapter>()
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState<any>(null);
  const [voice, setVoice] = useState<any>(null);

  const synth = window.speechSynthesis;

  useEffect(() => {
    if (currentChapter?.text) {
      const u = new SpeechSynthesisUtterance(extractTextFromHtml(currentChapter.text));
      setUtterance(u);

      synth.addEventListener("voiceschanged", () => {
        const voices = synth.getVoices();
        setVoice(voices[0]);
      });
    }
    return () => {
      synth.cancel();
      synth.removeEventListener("voiceschanged", () => { });
      setIsPlaying(false);
    }
  }, [currentChapter]);

  const modifyAndSetBook = (data: any) => {
    const bookInfo = {
      ...data.data,
      chapter: [
        {
          id: 0,
          title: 'Introduction',
          text: data.data.aboutTheBook
        },
        ...data.data.chapter.map((ele: any, index: number) => {
          return { ...ele, id: index + 1 }
        })
      ]
    }
    setBookData(bookInfo)
    setIsPlaying(false);
    setCurrentChapter(bookInfo.chapter[chapter == INTRODUCTION_CHAPTER ? 0 : parseInt(chapter as string)])
  }
  console.log(bookData);
  

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
  }, [bookId, chapter])

  const handleChangeChapter = (chapter: string) => {
    setIsPlaying(false)
    synth.cancel();
    synth.cancel();
    synth.removeEventListener("voiceschanged", () => { });
    router.push("/book/" + bookData?.id + "/" + `${chapter == "0" ? "introduction" : chapter}`)
  }

  return (
    <div className='relative flex flex-col items-start w-full'>
      <div className='w-full px-10 pt-10 pb-32 mobile:p-3 tablet:pt-8 overflow-y-auto scrollbar-hide tablet:px-20'>
        <Head>
          {bookData && bookData.title && <title>{bookData.title}</title>}
          {bookData && bookData.aboutTheBook && (
            <meta name='description' content={bookData.aboutTheBook} />
          )}
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <GoBackButton />

        {/* Floating Add to List Button */}
        {bookData && (
          <div className='fixed bottom-6 right-6 z-30 mobile:bottom-4 mobile:right-4'>
            <AddToListButton
              bookId={bookData.id}
              userId={userInfo?.id || ''}
              bookTitle={bookData.title}
              className="shadow-2xl"
            />
          </div>
        )}

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
                  {currentChapter &&
                    <div className='w-full mobile:px-0'>
                      <div className='flex flex-col gap-5 mt-5 w-full items-center justify-center'>
                        {currentChapter.id !== 0 &&
                          <h2 className='w-1/2 mobile:w-full mb-3 text-xl mt-5 font-bold mobile:text-xl text-sky-500 flex tablet:mt-5 mobile:mt-0 tablet:w-full'>
                            {currentChapter.id !== 0 &&
                              currentChapter.id.toString()}{'. '}
                            {decode(currentChapter.title)}
                          </h2>}
                        <div
                          className='text-lg mobile:text-md tablet:w-full text-gray-500 whitespace-pre-line tablet:mt-5 w-1/2 mobile:w-full'
                          dangerouslySetInnerHTML={{ __html: decode(currentChapter?.text?.replace(regex, "")) }}
                        ></div>
                      </div>
                    </div>}
                  <div className='w-full flex items-center justify-center mobile:w-full pt-10 mobile:pt-6 tablet:pt-8 mobile:p-0 tablet:w-full'>
                    <div className='w-1/2 mobile:w-full tablet:w-full flex flex-col gap-3 mobile:gap-5'>
                      <div className='w-full flex items-center justify-start'>
                        <div
                          className='cursor-pointer w-full flex outline-none items-center gap-1.5 text-sky-500 hover:underline text-left'
                          onClick={() => {
                            const changeTo = bookData?.chapter.find(
                              data => data.id === (currentChapter?.id ?? 0) - 1
                            )
                            handleChangeChapter(changeTo?.id.toString() ?? "Introduction")
                          }}
                        >
                          {currentChapter && currentChapter?.id > 0 && (
                            <>
                              <ArrowLeftIcon className='w-5 h-5' />
                              <span className='w-3/4 mobile:w-full line-clamp-1'>
                                {currentChapter.id - 1 > 0
                                  ? '#' + (currentChapter.id - 1)
                                  : ''}{' '}
                                {bookData?.chapter[currentChapter.id - 1].title ??
                                  'Previous'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
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
                                  {'#' + (currentChapter.id + 1)}{' '}
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

const mapStateToProps = (state: GlobalState) => {
  return {
    userInfo: state.main.userInfo
  }
}

export default connect(mapStateToProps)(Chapter)