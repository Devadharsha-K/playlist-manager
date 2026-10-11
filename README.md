# Linked Playlist: DSA use case (Doubly Linked List)

A full-stack music playlist manager. Songs are stored in a hand-written
doubly linked list (`DoublyLinkedList.js`), not an array. The UI draws the
live list with head, tail, and prev/next arrows.

## Operations and complexity
| Feature | Method | Time |
|---|---|---|
| Add to start / end | `addFirst` / `addLast` | O(1) |
| Add at position | `insertAt` | O(n) |
| Remove a song | `remove` | O(n) search, O(1) unlink |
| Next / Previous | `next` / `prev` | O(1) |
| Reverse list | `reverse` | O(n) |
| Repeat all | circular wrap from tail to head | O(1) |

## Tech
Node.js, Express (REST API), HTML/CSS/JS frontend served by Express.

## Run locally
```bash
npm install
npm start
# open http://localhost:3000
```

## API
`GET /api/playlist`, `POST /api/songs`, `DELETE /api/songs/:id`,
`POST /api/select/:id`, `/api/next`, `/api/prev`, `/api/reverse`, `/api/repeat`

## Deploy (one link, free)
1. Push this folder to a public GitHub repo.
2. On render.com: New > Web Service > connect the repo.
3. Build command `npm install`, start command `npm start`, then Deploy.
4. Paste the Render URL here: **Live demo:https://playlist-manager-wsr5.onrender.com**
**GitHub:** https://github.com/Devadharsha-K/playlist-manager

Note: data is held in memory, so it resets when the free server restarts.

## Why a doubly linked list?
Each song is a node with `prev` and `next` pointers, and the list keeps `head` and `tail`.
- Next and previous are O(1) pointer hops. A singly linked list could not go back without an O(n) walk.
- Adding or removing at the ends only re-links pointers, while an array would shift elements.
- Repeat all wraps tail to head with the tail pointer. Reverse swaps `prev`/`next` in every node, O(n).
- Trade-off: reaching the n-th song is O(n), and each node stores an extra pointer.

## Cover image
Search results bring their own album art. To set a default cover for songs without art, put a file named `cover.jpg` in the `public` folder.
