import { BsPlayFill, BsChevronDown, BsCheck } from 'react-icons/bs';
import { getDuration } from '../utils/time';
import { formatBytes } from '../utils/size';
import { Listbox } from '@headlessui/react';
import { useEffect, useState } from 'react';

export default function VideoResult({ data }) {
  const [selectedFormat, setSelectedFormat] = useState(data.formats?.[0]);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [errorImage, setErrorImage] = useState<number>(0);

  useEffect(() => {
    setErrorImage(Math.floor(Math.random() * 6));
  }, [data]);

  const download = async () => {
    try {
      setDownloading(true);
      const stream = await fetch(`${window.location.origin}/download?id=${data.id}&quality=${selectedFormat.itag}`);
      const blob = window.URL.createObjectURL(new Blob([await stream.blob()]));
      const link = document.createElement('a');
      link.href = blob;
      link.setAttribute('download', `${data.title} (${selectedFormat?.label}).mp4`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blob);
      setDownloading(false);
    } catch (error) {
      setDownloading(false);
      console.log(error);
    }
  };

  const qualityTag = (label: string): JSX.Element => {
    let tag;

    if (/2160p/.test(label)) {
      tag = '4K';
    } else if (/1440p/.test(label)) {
      tag = '2K';
    } else if (/1080p/.test(label)) {
      tag = 'FHD';
    } else if (/720p/.test(label)) {
      tag = 'HD';
    } else if (/480p/.test(label) || /360p/.test(label) || /240p/.test(label) || /144p/.test(label)) {
      tag = 'SD';
    }
    return <span className="text-xs py-1 px-2 rounded-md bg-gray-900/10 font-medium mr-2.5 -ml-1">{tag}</span>;
  };

  const DownloadOptions = (): JSX.Element => (
    <>
      <p className="text-xs font-medium mb-1">VIDEO QUALITY</p>

      <Listbox value={selectedFormat} onChange={setSelectedFormat} disabled={downloading}>
        <div className="relative mb-4">
          <Listbox.Button
            className={`relative w-full ${
              downloading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            } rounded-lg bg-white h-12 pl-4 pr-12 text-left shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20`}
          >
            <div className="flex flex-row items-center">
              {qualityTag(selectedFormat?.label)}
              <span className="pr-1.5">{selectedFormat?.label}</span>
              <span className="opacity-50 text-sm flex flex-1">({formatBytes(selectedFormat?.size)})</span>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <BsChevronDown className="w-5 h-5" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg border-1 border-black/5 focus:outline-none">
            {data.formats.map((format) => (
              <Listbox.Option
                key={format.itag}
                className={({ active }) =>
                  `relative group flex flex-row items-center cursor-pointer select-none pl-10 pr-4 h-10 ${
                    active ? 'bg-blue-600 text-white' : 'text-gray-900'
                  }`
                }
                value={format}
              >
                {({ selected }) => (
                  <>
                    <span className="flex truncate pr-1.5">{format.label}</span>
                    <span className="flex flex-1 opacity-50 text-sm">{formatBytes(format.size)}</span>
                    {selected && (
                      <span className="absolute inset-y-0 left-2.5 flex items-center text-gray-900 group-hover:text-white">
                        <BsCheck className="w-6 h-6" aria-hidden="true" />
                      </span>
                    )}
                    {qualityTag(format.label)}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>

      <button
        onClick={download}
        disabled={downloading}
        className={`flex flex-row items-center justify-center space-x-3 px-6 h-12 text-white ${
          downloading ? 'bg-blue-700 text-white/75 cursor-wait' : 'bg-blue-600'
        } rounded-lg active:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20 transition-all duration-75 ease-in-out`}
      >
        {downloading ? 'DOWNLOADING...' : 'DOWNLOAD'}
      </button>
    </>
  );

  const UnableToDownload = (): JSX.Element => (
    <div className="flex flex-col items-center justify-center w-full bg-white shadow-md rounded-lg p-6 text-center">
      <img
        src={`./images/error/${errorImage}.gif`}
        className="h-48 md:h-32 rounded-lg object-cover object-center mb-8 md:mb-6"
        draggable={false}
      />
      <p className="text-lg md:text-base font-medium mb-0.5">Can't download video</p>
      <p className="text-base md:text-sm text-gray-500">
        Recently uploaded videos can take a while to render... try again later
      </p>
    </div>
  );

  const VideoInfo = (): JSX.Element => (
    <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 items-start w-full md:w-screen max-w-screen-sm pb-10">
      <a
        href={`https://www.youtube.com/watch?v=${data.id}`}
        target="_blank"
        className="relative group flex flex-col focus:outline-none"
      >
        <div className="flex flex-col relative mb-2.5 select-none">
          <img
            src={data.image}
            className="relative md:w-80 aspect-16/9 rounded-lg shadow-lg md:group-hover:brightness-105 md:group-focus-visible:brightness-105 md:group-hover:shadow-xl md:group-focus-visible:shadow-xl transition-all duration-150 ease-in-out bg-gray-200 group-focus-visible:ring-4 group-focus-visible:ring-blue-600/20"
            draggable={false}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-black/70 shadow-sm md:opacity-0 md:scale-95 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 md:group-hover:scale-100 md:group-focus-visible:scale-100 text-white md:text-sm backdrop-blur-md backdrop-brightness-150 transition-all duration-150 ease-in-out">
            <BsPlayFill className="w-8 h-8 translate-x-0.5" />
          </div>
          <div className="absolute bottom-1.5 right-1.5 flex px-1.5 py-1 rounded-md bg-black/70 shadow-sm text-white text-sm md:text-xs backdrop-blur-md backdrop-brightness-150">
            {`${getDuration(data.duration)}`}
          </div>
        </div>

        <div className="md:w-80 font-medium line-clamp-2" aria-label={data.title}>
          {data.title}
        </div>
      </a>

      <div className="flex flex-col w-full">
        {data.formats.length === 0 ? <UnableToDownload /> : <DownloadOptions />}
      </div>
    </div>
  );

  return (
    <>
      {data ? (
        <VideoInfo />
      ) : (
        <div className="flex flex-row justify-center px-5 py-2.5 bg-red-600 text-white rounded-lg">
          Video is private or doesn't exist
        </div>
      )}
    </>
  );
}
