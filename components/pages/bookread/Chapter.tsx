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
import { decode } from 'html-entities'

let regex = /<\w+\s*>\s*<\/\w+\s*>/g;

const Chapter: React.FC = () => {
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

  // const handlePlayPause = () => {
  //   if (synth.speaking && !synth.paused) {
  //     synth.pause();
  //   } else {
  //     if (synth.paused) {
  //       synth.resume();
  //     } else {
  //       if (utterance) {
  //         synth.cancel();
  //         utterance.voice = voice;
  //         synth.speak(utterance);
  //       }
  //     }
  //   }
  //   setIsPlaying(!isPlaying);
  // };

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
      {/* {currentChapter?.id !== 0 &&
          <div className='sticky mobile:fixed w-full bottom-14 mobile:pb-3 flex items-center justify-center'>
            {currentChapter?.text &&
              <div className="flex items-center justify-center rounded-full bg-gray-100 drop-shadow-lg p-3 mobile:p-2">
                <button onClick={handlePlayPause}>
                  {isPlaying ? (
                    <PauseCircleIcon className="w-8 h-8 bg-sky-500 rounded-full text-white" />
                  ) : (
                    <PlayCircleIcon className="w-8 h-8 bg-sky-500 rounded-full text-white" />
                  )}
                </button>
                {!isPlaying ? (
                  <div className="w-full flex gap-[3px] items-center justify-center px-[28px] py-[18.5px]">
                    {[...Array(40)].map((_, i) => (
                      <div
                        key={i}
                        className="w-[3.5px] h-[3.5px] bg-sky-500 rounded-full"
                      ></div>
                    ))}
                  </div>
                ) :
                  <div>
                    <Lottie animationData={musicJson} loop={true} />
                  </div>}
              </div>}
          </div>} */}
    </div>
  )
}

export default Chapter