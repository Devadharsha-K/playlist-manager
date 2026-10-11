const express = require('express');
const cors = require('cors');
const path = require('path');
const DoublyLinkedList = require('./DoublyLinkedList');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const list = new DoublyLinkedList();
[['Midnight City', 'M83'], ['Genesis', 'Grimes'], ['Dreams', 'Fleetwood Mac']]
  .forEach(([t, a]) => list.addLast(t, a));

const reply = (res, op, complexity) =>
  res.json({ ...list.toJSON(), op, complexity });

// Only accept media URLs that come from Apple's CDN
const okUrl = u => typeof u === 'string' && /^https:\/\/[a-z0-9.-]+\.(mzstatic\.com|apple\.com)\//.test(u);

// Proxy to the free iTunes Search API (no key needed)
app.get('/api/search', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'Type a song or artist to search.' });
  try {
    const url = 'https://itunes.apple.com/search?' +
      new URLSearchParams({ term: q, media: 'music', entity: 'song', limit: '8' });
    const data = await (await fetch(url)).json();
    const results = (data.results || [])
      .filter(x => okUrl(x.previewUrl))
      .map(x => ({
        title: x.trackName, artist: x.artistName, previewUrl: x.previewUrl,
        artwork: (x.artworkUrl100 || '').replace('100x100', '200x200'),
      }));
    res.json({ results });
  } catch (e) {
    res.status(502).json({ error: 'Music search is unavailable right now. Try again in a moment.' });
  }
});

app.get('/api/playlist', (req, res) => reply(res, 'load', '-'));

app.post('/api/songs', (req, res) => {
  const title = String(req.body.title || '').trim();
  const artist = String(req.body.artist || '').trim();
  if (!title || !artist)
    return res.status(400).json({ error: 'Enter both a title and an artist.' });
  const meta = {
    previewUrl: okUrl(req.body.previewUrl) ? req.body.previewUrl : null,
    artwork: okUrl(req.body.artwork) ? req.body.artwork : null,
  };
  const { where = 'tail', index = 0 } = req.body;
  if (where === 'head') { list.addFirst(title, artist, meta); return reply(res, 'addFirst', 'O(1)'); }
  if (where === 'index') { list.insertAt(Number(index), title, artist, meta); return reply(res, 'insertAt', 'O(n)'); }
  list.addLast(title, artist, meta); reply(res, 'addLast', 'O(1)');
});

app.delete('/api/songs/:id', (req, res) => {
  if (!list.remove(Number(req.params.id)))
    return res.status(404).json({ error: 'That song is no longer in the playlist.' });
  reply(res, 'remove', 'O(n) search + O(1) unlink');
});

app.post('/api/select/:id', (req, res) => {
  if (!list.select(Number(req.params.id)))
    return res.status(404).json({ error: 'Song not found.' });
  reply(res, 'select', 'O(n)');
});

app.post('/api/next', (req, res) => { list.next(); reply(res, 'next', 'O(1)'); });
app.post('/api/prev', (req, res) => { list.prev(); reply(res, 'prev', 'O(1)'); });
app.post('/api/reverse', (req, res) => { list.reverse(); reply(res, 'reverse', 'O(n)'); });
app.post('/api/repeat', (req, res) => { list.repeat = !list.repeat; reply(res, 'repeat', 'O(1)'); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Playlist manager running on port ${PORT}`));
