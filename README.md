# simplecli

A personal CLI to shorten common dev commands.

## Install

```bash
npm install -g simplecli
```

## Usage

```
sli w d1 c <name>               # wrangler d1 create <name>
sli w d1 m a                    # wrangler d1 migrations apply
sli w d1 m a --remote           # wrangler d1 migrations apply --remote
sli w d1 m l                    # wrangler d1 migrations list
sli w d1 m l --remote           # wrangler d1 migrations list --remote
sli w d1 m c <name>             # wrangler d1 migrations create <name>
sli w kv c <name>               # wrangler kv:namespace create <name>
sli w r2 c <name>               # wrangler r2 bucket create <name>
sli w t                         # wrangler tail
sli w d                         # wrangler deploy
```

## Dev

```bash
npm install
npm run dev -- w d1 c my-db     # run without building
npm run build                   # compile to dist/
```

## Publish

```bash
npm publish
```
