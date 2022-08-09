const express = require('express');
const ytdl = require('ytdl-core');
const next = require('next');
const ffmpeg = require('ffmpeg-static');
const cp = require('child_process');
const port = parseInt(process.env.PORT, 10) || 3001;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  //=================//
  //    VIDEO API    //
  //=================//

  server.get('/getVideoDetails', async (req, res) => {
    const ID = req.query.id;
    try {
      const info = await ytdl.getBasicInfo(ID);
      const audioSize = Math.max([
        ...info?.player_response.streamingData.adaptiveFormats
          .filter((format) => format.mimeType.includes('audio/mp4'))
          .map((audio) => audio.contentLength),
      ]);
      const response = {
        id: ID,
        title: info.player_response.videoDetails.title,
        duration: info.player_response.streamingData.formats[0].approxDurationMs,
        image: `https://img.youtube.com/vi/${ID}/maxresdefault.jpg`,
        formats: info.player_response.streamingData.adaptiveFormats
          .filter((format) => format.mimeType.includes('video/mp4') && format.mimeType.includes('av01'))
          .map((format) => ({
            itag: format.itag,
            label: format.qualityLabel,
            size: parseFloat(format.contentLength) + parseFloat(audioSize),
          })),
      };
      res.send(JSON.stringify(response));
    } catch (error) {
      console.log(error);
      res.send(false);
    }
  });

  server.get('/download', async (req, res) => {
    const ID = req.query.id,
      quality = req.query.quality;
    const audio = ytdl(ID, { quality: 'highestaudio' });
    const video = ytdl(ID, { quality: quality });
    const ffmpegProcess = cp.spawn(
      ffmpeg,
      [
        // Remove ffmpeg's console spamming
        '-loglevel',
        '8',
        '-hide_banner',
        // Set inputs
        '-i',
        'pipe:3',
        '-i',
        'pipe:4',
        // '-movflags',
        // 'use_metadata_tags',
        // '-map_metadata',
        // '0',
        // Map audio & video from streams
        '-map',
        '0:a',
        '-map',
        '1:v',
        // '-qscale',
        // '0',
        // '-level',
        // '3.0',
        // Keep encoding
        '-c:v',
        'copy',
        // Set format and pipe to response
        '-f',
        'nut',
        'pipe:5',
      ],
      {
        windowsHide: true,
        stdio: [
          /* Standard: stdin, stdout, stderr */
          'inherit',
          'inherit',
          'inherit',
          /* Custom: pipe:3, pipe:4, pipe:5 */
          'pipe',
          'pipe',
          'pipe',
        ],
      },
    );
    audio.pipe(ffmpegProcess.stdio[3]);
    video.pipe(ffmpegProcess.stdio[4]);
    ffmpegProcess.stdio[5].pipe(res);
  });

  //======================//
  //    NEXT JS SERVER    //
  //======================//

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  //===================//
  //    SERVER INIT    //
  //===================//

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
