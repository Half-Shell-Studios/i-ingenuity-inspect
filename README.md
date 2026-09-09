# I-Ingenuity Inspect

Expo / React Native field app for inspections and work orders. It talks to the I-Ingenuity Laravel API and stores downloaded work-order data in on-device SQLite.

This repo is **not** the API. Docker, MySQL, Redis, and Mailhog live in [`i-ingenuity-3`](../i-ingenuity-3).

Native modules (`expo-sqlite`, `expo-secure-store`, `react-native-pdf-renderer`, `expo-dev-client`) mean you need a **development build**. Expo Go will not run this app.

## Prerequisites

- Node.js 20+
- Xcode (iOS simulator) and/or Android Studio
- Docker, with the API stack running (see below)

## 1. Start the API

From the API repo:

```bash
cd ~/PhpstormProjects/i-ingenuity-3
docker compose up -d
```

On this machine the published ports are:

| Service | URL |
| --- | --- |
| API / web | http://localhost:8130 |
| Mailhog | http://localhost:8132 |

Seed once if you need a login:

```bash
docker compose exec app php artisan db:seed
```

Default account: `support@i-ingenuity.com` / `Password123!`

Password-reset and other outbound mail from the API show up in Mailhog. Follow the Local development section in `i-ingenuity-3/README.md` if the stack is not up yet.

## 2. Configure this app

```bash
cd ~/PhpstormProjects/i-ingenuity-inspect
cp .env.example .env
```

Edit `.env` if needed. Restart Metro after changing it.

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_API_URL` | Axios base URL (example: `http://localhost:8130/api/v1`) |
| `EXPO_PUBLIC_DEV_USER` | Optional. Prefills the login email |
| `EXPO_PUBLIC_DEV_USER_PASS` | Optional. Prefills the login password |

| Client | `EXPO_PUBLIC_API_URL` |
| --- | --- |
| iOS simulator / Android emulator | `http://localhost:8130/api/v1` |
| Physical device on the same LAN | `http://<your-mac-lan-ip>:8130/api/v1` |
| Shared beta API | `https://beta.i-ingenuity.com/api/v1` |

## 3. Install and run

```bash
npm install
```

First time on a machine, build and install the native dev client:

```bash
npx expo run:ios
# or
npx expo run:android
```

That compiles **I-Ingenuity**, installs it on the simulator/emulator, and starts Metro. After that, day to day is:

```bash
npx expo start
```

Then open the **I-Ingenuity** app (not Expo Go).

`npx expo start` only starts the JS bundler. Pressing `i` will fall back to Expo Go if no development build is installed, and this project will not load there.

### Simulator

Use the **iPhone 16 Pro** (or whichever device `expo run:ios` booted). Ignore **iPhone 15 Pro — External Display** if it appears; that window is a blank extra screen. Turn it off with **I/O → External Displays → Off**.

On first open you may see **I-Ingenuity Development Build** with a green server and **Open in 'I-Ingenuity'?** Tap **Open**, or tap the green **I-Ingenuity** row.

### Physical iPhone

The simulator binary cannot be copied onto a real phone. Plug the phone in, enable Developer Mode, tap Trust, stay on the same Wi-Fi as the Mac, keep Metro running, then:

```bash
npx expo run:ios --device
```

Open **I-Ingenuity**, not Expo Go. Point `EXPO_PUBLIC_API_URL` at the Mac’s LAN IP, not `localhost`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Metro / Expo dev server |
| `npm run ios` | Build and launch the iOS dev client |
| `npm run android` | Build and launch the Android dev client |
| `npm run web` | Expo web (limited; this app is built for native) |
| `npm run lint` | ESLint |

Rebuild with `npx expo run:ios` / `run:android` when native code changes (new native module, `app.json` plugin, or a clean machine). JS-only work is Metro plus Fast Refresh.

## Day to day

1. `docker compose up -d` in `i-ingenuity-3` if the API is down
2. `npx expo start` in this repo
3. Open **I-Ingenuity** on the simulator
4. Log in with the seeded user (or whatever you put in `.env`)
5. Check Mailhog at http://localhost:8132 if you trigger mail from the API
