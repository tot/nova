# Nova

A cross-platform peer-to-peer file sharing application

## Tech Stack

- Electron
- React
- TypeScript
- TailwindCSS
- SQLite3
- Prisma

## Install

Clone the repo and install dependencies:

```bash
git clone --depth 1 --branch main https://github.com/tot/nova.git your-project-name
cd your-project-name
npm install
```

## Starting Development

Set up the local database:

```bash
npm run initialize
```

> NOTE: On every change to `prisma.schema`, you must run `npm run reset:dev`

Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```
