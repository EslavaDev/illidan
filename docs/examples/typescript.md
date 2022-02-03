# Typescript support

Cronos support Typescript using babel-typescript plugin, it means during build phase types won't be checked. If you need development type checking, follow these instructions:

## Install

```bash
npm i typescript
```

## Setup

1. Create your tsconfig.json: See https://www.typescriptlang.org/docs/handbook/tsconfig-json.html

2. Add this script to your package.json scripts section

```json
{
  "scripts": {
    "ts-check": "tsc --project tsconfig.json --noEmit"
  }
}
```