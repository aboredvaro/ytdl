import { useState } from 'react';
import { FiArrowRight, FiLoader } from 'react-icons/fi';
import { getVideoID } from 'ytdl-core';

export default function Home({}) {
  const [URL, setURL] = useState<string>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch(`${window.location.origin}/getVideoDetails?url=${URL}`)
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          console.log(res);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const url: string = e.target.value;
    if (url.length > 0) {
      setURL(getVideoID(url));
    } else {
      setURL(null);
    }
  };

  return (
    <div className="relative flex h-screen max-h-screen w-screen flex-col items-center justify-center px-5 bg-gray-100">
      <p className="select-all">https://www.youtube.com/watch?v=2HcVZm_4qAI</p>

      <form
        onSubmit={(e) => onSubmit(e)}
        className="relative flex w-full min-w-fit flex-row rounded-xl shadow-md focus-within:shadow-xl sm:max-w-screen-sm transition-all duration-150"
      >
        <input
          className="h-16 w-full appearance-none rounded-xl text-lg bg-white px-5 pr-16 outline-none"
          placeholder="Enter the video url"
          onChange={(e) => onChange(e)}
          disabled={loading}
        />

        <button
          className={`absolute right-2 flex flex-row items-center justify-center top-2 h-12 w-12 rounded-lg transition-all duration-150 ${
            URL ? 'text-gray-800 hover:bg-gray-100 active:bg-gray-200' : 'text-gray-200'
          }`}
          disabled={URL === null || loading}
        >
          {loading ? <FiLoader className="w-7 h-7 animate-spin" /> : <FiArrowRight className="w-7 h-7" />}
        </button>
      </form>
    </div>
  );
}
