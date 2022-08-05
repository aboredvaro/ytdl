const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get('/getVideoDetails', async (req, res) => {
    let URL = req.query.url;
    const info = await ytdl.getBasicInfo(URL);

    const response = {
      title: info.player_response.videoDetails.title,
      image:
        info.player_response.videoDetails.thumbnail.thumbnails[
          info.player_response.videoDetails.thumbnail.thumbnails.length - 1
        ].url,
    };

    res.send(JSON.stringify(response));
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
