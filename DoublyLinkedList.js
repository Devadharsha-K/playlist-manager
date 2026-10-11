// Hand-written doubly linked list. No arrays are used to store songs.
class Node {
  constructor(id, title, artist, meta = {}) {
    this.id = id; this.title = title; this.artist = artist;
    this.previewUrl = meta.previewUrl || null; this.artwork = meta.artwork || null;
    this.prev = null; this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null; this.tail = null; this.current = null;
    this.size = 0; this.repeat = false; this._id = 1;
  }

  _node(title, artist, meta) { return new Node(this._id++, title, artist, meta); }

  _afterFirstInsert(n) { if (!this.current) this.current = n; this.size++; }

  // O(1)
  addFirst(title, artist, meta) {
    const n = this._node(title, artist, meta);
    if (!this.head) this.head = this.tail = n;
    else { n.next = this.head; this.head.prev = n; this.head = n; }
    this._afterFirstInsert(n); return n;
  }

  // O(1) thanks to the tail pointer
  addLast(title, artist, meta) {
    const n = this._node(title, artist, meta);
    if (!this.tail) this.head = this.tail = n;
    else { n.prev = this.tail; this.tail.next = n; this.tail = n; }
    this._afterFirstInsert(n); return n;
  }

  // O(n): walk to the index, then relink 4 pointers
  insertAt(index, title, artist, meta) {
    if (index <= 0) return this.addFirst(title, artist, meta);
    if (index >= this.size) return this.addLast(title, artist, meta);
    let at = this.head;
    for (let i = 0; i < index; i++) at = at.next;
    const n = this._node(title, artist, meta);
    n.prev = at.prev; n.next = at;
    at.prev.next = n; at.prev = n;
    this._afterFirstInsert(n); return n;
  }

  // O(n) search, O(1) unlink
  remove(id) {
    let n = this.head;
    while (n && n.id !== id) n = n.next;
    if (!n) return false;
    if (n.prev) n.prev.next = n.next; else this.head = n.next;
    if (n.next) n.next.prev = n.prev; else this.tail = n.prev;
    if (this.current === n) this.current = n.next || n.prev;
    this.size--; return true;
  }

  // O(n): find node by id
  select(id) {
    let n = this.head;
    while (n && n.id !== id) n = n.next;
    if (n) this.current = n;
    return !!n;
  }

  // O(1)
  next() {
    if (!this.current) return;
    this.current = this.current.next || (this.repeat ? this.head : this.current);
  }

  // O(1)
  prev() {
    if (!this.current) return;
    this.current = this.current.prev || (this.repeat ? this.tail : this.current);
  }

  // O(n): swap prev/next on every node, then swap head/tail
  reverse() {
    let n = this.head;
    while (n) { [n.prev, n.next] = [n.next, n.prev]; n = n.prev; }
    [this.head, this.tail] = [this.tail, this.head];
  }

  // For the API/UI only: walk the list head to tail
  toJSON() {
    const songs = [];
    for (let n = this.head; n; n = n.next)
      songs.push({ id: n.id, title: n.title, artist: n.artist, previewUrl: n.previewUrl, artwork: n.artwork });
    return {
      songs, size: this.size, repeat: this.repeat,
      currentId: this.current ? this.current.id : null,
    };
  }
}

module.exports = DoublyLinkedList;
