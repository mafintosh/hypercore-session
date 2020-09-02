module.exports = class HypercoreSession {
  constructor (feed, opts) {
    this.feed = feed
    this.checkout = (opts && opts.checkout) || 0
    this.defaults = opts || null
    this.gets = new Set()
    this.downloads = new Set()
  }

  get length () {
    return this.checkout || this.feed.length
  }

  clone () {
    return new HypercoreSession(this.feed, this.defaults)
  }

  ready () {
    return new Promise((resolve, reject) => {
      this.feed.ready(function (err) {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  download (range) {
    return new Promise((resolve, reject) => {
      const download = this.feed.download(range, function (err) {
        this.downloads.delete(download)
        if (err) reject(err)
        else resolve()
      })
      this.downloads.add(download)
    })
  }

  update (opts = this.defaults) {
    return new Promise((resolve, reject) => {
      // TODO: updates should be cancellable
      this.feed.update(opts, function (err) {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  get (seq, opts = this.defaults) {
    return new Promise((resolve, reject) => {
      const get = this.feed.get(seq, opts, function (err, block) {
        this.gets.delete(get)
        if (err) reject(err)
        else resolve(block)
      })
      this.gets.add(get)
    })
  }

  cancel () {
    for (const get of this.gets) this.feed.cancel(get)
    for (const download of this.downloads) this.feed.undownload(download)
  }
}
