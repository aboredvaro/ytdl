import { Transition } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { FiLoader } from 'react-icons/fi';
import { getVideoID, validateURL } from 'ytdl-core';
import VideoResult from '../components/VideoResult';

export default function Home({}) {
  const [URL, setURL] = useState<string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [firstSearch, setFirstSearch] = useState<boolean>(true);
  const [searchResult, setSearchResult] = useState({});
  const searchInput = useRef(null);

  useEffect(() => {
    searchInput.current.focus();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    (document.activeElement as HTMLElement).blur();

    try {
      await fetch(`${window.location.origin}/getVideoDetails?id=${URL}`)
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          firstSearch && setFirstSearch(false);
          setSearchResult(res);
        });
    } catch (error) {
      setLoading(false);
      setSearchResult(null);
      console.log(error);
    }
  };

  const onChange = (e) => {
    const url: string = e.target.value;
    if (url.length > 0 && validateURL(url)) {
      setURL(getVideoID(url)); //TODO ---> Validate video id
    } else {
      setURL(null);
    }
  };

  return (
    <div className="relative flex h-screen max-h-screen w-screen flex-col items-center pt-10 md:pt-24 px-4">
      <div className="flex flex-row items-center space-x-2 md:space-x-2.5">
        <img src="./logos/logo.png" className="w-8 md:w-11" draggable={false} />
        <p className="text-2xl md:text-4xl font-medium">Downtube</p>
      </div>

      <p className="mt-2 md:mt-4 text-sm text-gray-500">Download Youtube videos in the highest quality</p>

      <form
        onSubmit={(e) => onSubmit(e)}
        className="relative flex w-full min-w-fit flex-row my-6 md:my-10 rounded-xl shadow-md focus-within:shadow-xl sm:max-w-screen-sm transition-all duration-150"
      >
        <input
          id="searchInput"
          ref={searchInput}
          className="h-14 md:h-16 w-full appearance-none rounded-xl text-lg bg-white px-5 pr-16 outline-none"
          placeholder="Enter the video url"
          onChange={(e) => onChange(e)}
          autoComplete="off"
          spellCheck={false}
          disabled={loading}
        />

        <button
          className={`absolute right-1 md:right-2 flex flex-row items-center justify-center top-1 md:top-2 h-12 w-12 rounded-lg focus:outline-none focus-visible:bg-blue-600 focus-visible:text-white transition-all duration-150 ${
            URL ? 'text-gray-800' : 'text-gray-200'
          }`}
          disabled={URL === null || loading}
        >
          {loading ? <FiLoader className="w-6 h-6 animate-spin" /> : <BsArrowRight className="w-6 h-6" />}
        </button>
      </form>

      <p className="select-all opacity-0 hover:opacity-20 absolute top-0 left-0">
        https://www.youtube.com/watch?v=b7-Mq6i9H0k
      </p>
      <p className="select-all opacity-0 hover:opacity-20 absolute top-0 right-0">
        https://www.youtube.com/watch?v=2HcVZm_4qAI
      </p>

      <Transition
        as="div"
        show={!firstSearch && !loading}
        enter="transform duration-250 transition ease-out"
        enterFrom="opacity-0 translate-y-10"
        enterTo="opacity-100 translate-y-0"
        leave="transform duration-100 transition ease-in"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <VideoResult data={searchResult} />
      </Transition>
    </div>
  );
}
