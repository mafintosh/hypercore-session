# hypercore-session

Make a session from a Hypercore that can auto cancel all inflight requests / downloads.

```
npm install hypercore-session
```

## Usage

``` js
const HypercoreSession = require('hypercore-session')

const session = new HypercoreSession(feed)

// get a block
const block = await session.get(42)

// get a bunch of blocks
await session.download({ start: 0, end: 42 })

// cancel all currently inflight
session.cancel()
```

## License

MIT
