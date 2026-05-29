# Technical Walkthrough

## What the app does

MangaReader is a React Native manga reader demo. The user starts at a login screen, enters the app through a test session, chooses a manga from a small local library, and reads chapter pages rendered from bundled image assets.

There are two related codebases:

- Expo project: `C:\Users\danie\Documents\GitHub\MangaReader\MangaReader`
- Bare React Native CLI project: `C:\Users\danie\Documents\GitHub\Manga-Reader\MangaReaderBare`

The Expo project is the fuller product prototype. It contains many screens, themes, tabs, settings panels, Google sign-in support, profile state, reader settings, and multiple UI experiments.

The bare React Native CLI project is intentionally smaller. It ports only the core app flow needed to demonstrate native React Native understanding:

1. Login
2. Manga selection / library
3. Reader

That was a deliberate scope decision. The goal was not to copy the full Expo app, but to show that the same product flow can run in a clean React Native CLI app with explicit navigation, local state, native Android configuration, and a Play Store release build.

## High-Level App Flow

### Login flow

In the bare CLI project, the app starts in `App.tsx`, which wraps the UI in `SafeAreaProvider`, sets the status bar, and renders `AppNavigator`.

`AppNavigator.tsx` checks `authService.getStoredSession()` from AsyncStorage. If there is a stored session, the first route is `Library`; otherwise, it is `Login`.

`LoginScreen.tsx` shows the MangaVerse branding and a single mocked login button: “Continue as Test Reader.” Pressing it calls `signInWithTestAccount()`, stores a small local session, and replaces the navigation route with `Library`.

This replaces the more complex Expo auth flow with a demo-friendly local session.

### Manga selection / library flow

`MangaSelectionScreen.tsx` loads manga data through `mangaService.getMangas()`. It shows loading and error states, then renders each manga with `MangaCard`.

When the user taps a manga, React Navigation opens:

```ts
navigation.navigate('Reader', {mangaId: item.id});
```

The library also includes sign-out, which clears the stored session and returns to `Login`.

### Reader flow

`ReaderScreen.tsx` receives the selected `mangaId` from route params. It calls:

- `getMangaById(mangaId)`
- `getChaptersByManga(mangaId)`
- `getPagesByChapter(chapterId)`

The first chapter is selected by default. The pages are rendered in a vertical `FlatList` using `ReaderPage`, which displays each page through React Native's built-in `Image`.

The top bar has a Back button, so the user can return to the library.

### Navigation between screens

The bare CLI app uses a native stack navigator:

- `Login`
- `Library`
- `Reader`
- `Legal`

The Expo app uses file-based routing through `expo-router`, while the bare app uses explicit route declarations and typed route params in `src/types/manga.ts`.

# Expo vs Bare CLI Comparison

## Expo Project Architecture

Important folders and files:

- `app/_layout.tsx`: root Expo Router layout, providers, fonts, splash screen, and route declarations.
- `app/login.tsx`: Expo login screen.
- `app/(tabs)/index.tsx`: main home/library style screen with many sections and themes.
- `app/reader/[id].tsx`: full reader screen.
- `src/context/AuthContext.tsx`: auth state, Google sign-in, token persistence.
- `src/auth/googleAuth.ts` and `src/auth/googleAuth.native.ts`: Google auth implementation.
- `src/auth/localAuthStorage.ts`: local auth persistence.
- `src/data/db.ts`: local manga, mangaka, chapter, and page data.
- `src/data/mangaMockData.ts`: screen-facing manga helpers built from `db.ts`.
- `constants/theme.ts`, `src/context/ThemeContext.tsx`, and many components: theme-heavy UI system.

### How routing works in Expo

The Expo app uses `expo-router`. File paths define routes:

- `app/login.tsx` becomes `/login`
- `app/(tabs)/index.tsx` becomes the tab home route
- `app/reader/[id].tsx` becomes `/reader/:id`
- `app/manga/[id].tsx` becomes `/manga/:id`

Navigation happens through `useRouter()`:

```ts
router.replace('/(tabs)');
router.push(`/reader/${item.id}`);
router.back();
```

The root layout uses:

```tsx
<Stack.Screen name="login" />
<Stack.Screen name="(tabs)" />
<Stack.Screen name="reader/[id]" />
```

### How auth/login works in Expo

The Expo login screen uses `useAuth()` from `src/context/AuthContext.tsx`. That context configures Google sign-in, loads stored user/token state, exposes `signInWithGoogle()`, and persists auth data through local storage helpers.

The login screen also has a `SKIP` button that routes directly to `/(tabs)`. Other social login buttons are present but disabled.

### How manga data is loaded in Expo

The clean data source is `src/data/db.ts`. It defines:

- `MANGAKAS`
- `MANGAS`
- `CHAPTERS`
- `PAGES`
- async helpers like `db.getMangas()`, `db.getChaptersByManga()`, and `db.getPagesByChapter()`

Images are statically imported with `require(...)` so Metro can bundle local assets.

The home screen, manga screens, and reader use this local data layer, sometimes through helpers in `mangaMockData.ts` or user profile enrichment from `UserProfileContext`.

### How the Expo reader displays pages

`app/reader/[id].tsx` is a full-featured reader. It supports:

- route param lookup with `useLocalSearchParams()`
- manga lookup
- chapter/page loading
- reading progress
- vertical, left-to-right, and right-to-left reading direction
- page controls
- reader settings panel
- AsyncStorage for reader preferences
- `expo-image` for page image rendering
- Expo-specific visual tools like `expo-blur`

It is powerful, but much larger than needed for an interview demo port.

### Expo-specific tools/APIs used

The Expo project uses several Expo-specific or Expo-oriented tools:

- `expo-router`
- `expo-image`
- `expo-blur`
- `expo-font`
- `expo-splash-screen`
- `expo-status-bar`
- `@expo/vector-icons`
- Expo app config in `app.json`
- EAS-related config in `eas.json`

Those were intentionally not ported into the bare CLI app.

## Bare React Native CLI Project Architecture

Important folders and files:

- `App.tsx`: minimal app root.
- `src/navigation/AppNavigator.tsx`: React Navigation stack setup.
- `src/screens/LoginScreen.tsx`: mocked login flow.
- `src/screens/MangaSelectionScreen.tsx`: library screen.
- `src/screens/ReaderScreen.tsx`: page reader.
- `src/screens/LegalScreen.tsx`: Terms and Privacy copy ported from Expo.
- `src/components/MangaCard.tsx`: reusable library card.
- `src/components/ReaderPage.tsx`: reusable page image renderer.
- `src/services/authService.ts`: AsyncStorage-backed test session.
- `src/services/mangaService.ts`: local manga, chapters, pages, and async data helpers.
- `src/types/manga.ts`: route and data types.
- `android/app/build.gradle`: Android app ID, version, signing, release config.
- `android/gradle.properties`: Android/React Native build flags.

### How React Navigation replaces expo-router

Instead of file-based routing, the bare app declares routes explicitly:

```tsx
<Stack.Screen name="Login" component={LoginScreen} />
<Stack.Screen name="Library" component={MangaSelectionScreen} />
<Stack.Screen name="Reader" component={ReaderScreen} />
<Stack.Screen name="Legal" component={LegalScreen} />
```

Route params are typed in `RootStackParamList`:

```ts
Reader: {mangaId: string; chapterId?: string};
Legal: {type: 'privacy' | 'terms'};
```

This makes navigation easy to explain in an interview because every screen and param is visible in one place.

### How login/session is handled

The bare app avoids full Google/Firebase auth. `authService.ts` stores a mocked session:

```ts
{
  id: 'test-reader',
  name: 'Test Reader'
}
```

It uses `@react-native-async-storage/async-storage`, which works in bare React Native CLI. The navigator checks for this session on boot and decides whether to show `Login` or `Library`.

### How manga data is loaded

`mangaService.ts` contains a small subset of the Expo data model:

- 4 manga entries
- generated first chapters
- statically required local page images
- async helper functions

The service returns Promises and includes a small artificial delay. That keeps UI loading states realistic without needing a backend.

### How images/pages are rendered

The bare app uses React Native's built-in `Image` component. It renders local bundled images from `require(...)`.

`ReaderPage.tsx` calculates a responsive page width and uses a simple 1.5 height ratio:

```tsx
<Image
  source={page.image}
  style={[styles.image, {width: pageWidth, height: pageWidth * 1.5}]}
  resizeMode="contain"
/>
```

This is simpler than the Expo reader but good enough to demonstrate the core reading experience.

### How Android native structure differs from Expo

The bare project owns the native Android folder directly:

- `android/app/build.gradle`
- `android/build.gradle`
- `android/gradle.properties`
- `android/app/src/main/AndroidManifest.xml`
- Kotlin files under `android/app/src/main/java/...`
- launcher icons under `android/app/src/main/res/mipmap-*`

This means app ID, versioning, signing, target SDK, minification, and bundle generation are handled manually through Gradle.

The current Play package name is:

```gradle
applicationId "com.boldreams.mangareadercli"
```

The current version is:

```gradle
versionCode 2
versionName "1.1"
```

Target SDK is set to API 35 through `android/build.gradle`.

Release signing is configured through ignored local files:

- `android/keystores/mangareader-upload-key.jks`
- `android/signing.properties`

Those files should be backed up securely and not committed.

## Key Differences Between Expo And Bare CLI

### Routing

Expo uses filesystem routes with `expo-router`. Adding a screen usually means adding a file under `app/`.

Bare CLI uses React Navigation explicitly. Screens are registered manually in `AppNavigator.tsx`.

### Native folders

Expo abstracts much of the native setup unless you prebuild or eject. The Expo project still has config files like `app.json` and EAS setup.

Bare CLI includes full native Android and iOS folders from the start. Android package, signing, target SDK, Gradle config, and icons are directly editable.

### Build and deployment workflow

Expo commonly uses Expo tooling and EAS builds.

Bare CLI uses Gradle directly:

```bash
cd android
.\gradlew.bat bundleRelease
```

The resulting AAB is:

```txt
android/app/build/outputs/bundle/release/app-release.aab
```

### Android Gradle setup

In bare CLI, `android/app/build.gradle` controls:

- `namespace`
- `applicationId`
- `versionCode`
- `versionName`
- `signingConfigs`
- `buildTypes`
- release minification

This was important for Google Play because the bundle needed the exact package name `com.boldreams.mangareadercli`.

### Image rendering

Expo used `expo-image`, which has features like `contentFit` and transitions.

Bare CLI uses React Native `Image`, which is simpler and avoids Expo dependencies. Local page assets are still bundled with static `require(...)` calls.

### Storage/session handling

Expo auth uses an `AuthContext`, Google sign-in helpers, token persistence, and user state.

Bare CLI uses AsyncStorage directly through `authService.ts`. The session is mocked because the goal is to demonstrate the app flow without dragging in OAuth, Firebase, or native Google Sign-In setup.

### Dependency management

Expo projects often rely on Expo-compatible packages and Expo-managed versions.

Bare CLI dependencies are installed directly in `package.json`. For navigation, the project uses:

- `@react-navigation/native`
- `@react-navigation/native-stack`
- `react-native-screens`
- `react-native-safe-area-context`
- `@react-native-async-storage/async-storage`

### Google Play release process

Expo can delegate more release work to EAS.

Bare CLI needs manual release work:

- correct package name
- target SDK
- release version increment
- upload keystore
- signed App Bundle
- Play Console privacy/data safety/store listing

The project now builds a signed release AAB, but the Play Console listing work still happens outside the codebase.

# Challenges Solved

## 1. Replacing `expo-router` with React Navigation

Issue: The Expo app used file-based routing, but bare React Native CLI does not include `expo-router`.

Why it matters: Navigation is one of the core app flows. Login, library, and reader need clean route transitions.

How it worked in Expo: Routes came from files like `app/login.tsx`, `app/(tabs)/index.tsx`, and `app/reader/[id].tsx`. Code navigated with `useRouter()`.

How it needed to work in bare CLI: Routes had to be declared manually with React Navigation.

Solution implemented: Added `src/navigation/AppNavigator.tsx` with a native stack navigator and typed route params in `src/types/manga.ts`.

## 2. Replacing Expo-specific APIs

Issue: The Expo reader and app shell used APIs like `expo-router`, `expo-image`, `expo-blur`, `expo-font`, `expo-splash-screen`, and `@expo/vector-icons`.

Why it matters: Keeping those dependencies would defeat the purpose of a bare CLI port and add unnecessary native configuration.

How it worked in Expo: Expo packages handled images, routing, fonts, splash screen, status bar, and visual effects.

How it needed to work in bare CLI: The core app needed to run with standard React Native and a small dependency set.

Solution implemented: Used React Native `Image`, React Native `StatusBar`, React Navigation, and simple text buttons instead of Expo icons/blur/fonts.

## 3. Handling local manga/page assets

Issue: The app needs page images to render in the reader.

Why it matters: Metro needs static `require(...)` calls for bundled local images. Dynamic file paths are fragile in React Native.

How it worked in Expo: `src/data/db.ts` statically required many local assets under `assets/manga`.

How it needed to work in bare CLI: The bare app needed its own assets folder and static requires that Metro could bundle.

Solution implemented: Copied the required `assets/manga` folder into the bare app and created `mangaService.ts` with explicit `require(...)` imports for covers and pages.

## 4. Keeping reader functionality simple and demo-ready

Issue: The Expo reader is large and includes reading direction controls, auto-play style state, settings panels, progress tracking, uploaded PDF handling, and disabled future features.

Why it matters: Porting all of that would make the bare app harder to explain and risk introducing bugs unrelated to the core demo.

How it worked in Expo: The reader combined UI, settings, AsyncStorage preferences, profile progress, and image rendering in one rich screen.

How it needed to work in bare CLI: The reader only needed to show selected manga pages and support back navigation.

Solution implemented: `ReaderScreen.tsx` loads manga/chapter/pages from `mangaService`, renders pages in a vertical `FlatList`, and uses a small `ReaderPage` component.

## 5. AsyncStorage-backed login/session

Issue: Full Google login requires native auth setup, API keys, and provider configuration.

Why it matters: For an interview demo, auth should prove the flow without adding setup risk.

How it worked in Expo: `AuthContext` configured Google sign-in, persisted user and token data, and exposed auth state.

How it needed to work in bare CLI: The app needed a login gate that survives app restarts.

Solution implemented: `authService.ts` stores a small test session in AsyncStorage. `AppNavigator.tsx` reads that session and chooses the initial route.

## 6. Android native build setup

Issue: Bare React Native exposes native Android configuration directly.

Why it matters: Google Play requires the correct package name, target SDK, release signing, and versioning.

How it worked in Expo: Android package and app config were mostly expressed through `app.json` and EAS/Expo tooling.

How it needed to work in bare CLI: Gradle files and Kotlin package declarations had to match.

Solution implemented: Updated `android/app/build.gradle`, app name resources, launcher icons, target SDK, Kotlin package declarations, and release signing config.

## 7. Gradle/release signing

Issue: A release App Bundle cannot be uploaded if it is unsigned or signed with debug credentials.

Why it matters: Google Play requires a signed Android App Bundle.

How it worked in Expo: EAS can manage credentials and produce release artifacts.

How it needed to work in bare CLI: The project needed a local upload keystore and Gradle signing config.

Solution implemented: Added release signing support in `android/app/build.gradle`, generated an ignored upload keystore, and verified `bundleRelease`.

Important: `android/keystores/mangareader-upload-key.jks` and `android/signing.properties` are local secrets. They must be backed up securely.

## 8. Keeping the project interview-friendly

Issue: The Expo app has many features and experiments that are interesting but distracting.

Why it matters: In an interview, it is better to explain a small, coherent architecture than a large partial migration.

How it worked in Expo: The app contains tabs, themes, profile state, commerce-like data, settings, reader experiments, and multiple card types.

How it needed to work in bare CLI: The demo should show native React Native workflow and the essential product path.

Solution implemented: The bare app uses a focused `src/` structure: navigation, screens, components, services, and types.

# Interview Demo Plan

## Files to open and explain

1. `App.tsx`

Show that the bare app root is intentionally small: safe area provider, status bar, and navigator.

2. `src/navigation/AppNavigator.tsx`

Explain how React Navigation replaces Expo Router. Point out the initial route logic based on stored session.

3. `src/types/manga.ts`

Show typed route params and shared domain types: `Manga`, `Chapter`, `MangaPage`, and `RootStackParamList`.

4. `src/screens/LoginScreen.tsx`

Explain mocked login, loading/error state, and Terms/Privacy links.

5. `src/services/authService.ts`

Show AsyncStorage session persistence and sign-out.

6. `src/screens/MangaSelectionScreen.tsx`

Show async data loading, error handling, sign-out, and navigation to reader.

7. `src/components/MangaCard.tsx`

Show a simple reusable component for library rows.

8. `src/screens/ReaderScreen.tsx`

Explain route params, manga/chapter/page loading, error states, and vertical page list.

9. `src/components/ReaderPage.tsx`

Show local image rendering with React Native `Image`.

10. `src/services/mangaService.ts`

Explain the local data layer and why static requires are used for bundled assets.

11. `android/app/build.gradle`

Show package name, version, target signing config, and release build setup.

12. `android/gradle.properties`

Show AndroidX, Hermes, architecture config, and compile SDK suppression.

## Demo sequence

1. Start at `App.tsx`.
2. Open `AppNavigator.tsx` and explain the routes.
3. Open `LoginScreen.tsx` and `authService.ts`.
4. Open `MangaSelectionScreen.tsx` and `mangaService.ts`.
5. Open `ReaderScreen.tsx` and `ReaderPage.tsx`.
6. Open `android/app/build.gradle` to show native release readiness.
7. Mention the generated AAB path:

```txt
android/app/build/outputs/bundle/release/app-release.aab
```

## Build commands to mention

```bash
npm run lint
npx tsc --noEmit
cd android
.\gradlew.bat bundleRelease
```

The current successful release build uses:

- `applicationId "com.boldreams.mangareadercli"`
- `versionCode 2`
- `versionName "1.1"`

From now on, each successful release build should increment the version by 1.

## Honest limitations

- The bare app uses mocked/test login, not real Google auth.
- It only ports four manga entries, not the full Expo catalog.
- The reader is vertical-only and does not include the Expo reader's advanced settings.
- No remote API/backend is connected.
- Play Console tasks like store listing, screenshots, hosted privacy URL, data safety form, and content rating are still outside the codebase.
- The upload keystore exists locally and must be backed up securely.

# Short Talking Points

## “What does the project do?”

It is a manga reader demo. A user logs in with a test session, browses a small local manga library, selects a manga, and reads chapter pages rendered from bundled image assets.

## “What part did you work on?”

I ported the core product flow from a larger Expo prototype into a clean bare React Native CLI app. I focused on login, library selection, reader navigation, local manga data, page rendering, and Android release readiness.

## “What code did you write?”

I wrote the bare app structure under `src/`: the React Navigation stack, login screen, library screen, reader screen, reusable card/page components, AsyncStorage auth service, manga data service, and TypeScript route/domain types. I also configured Android package name, versioning, signing, icons, and release bundle generation.

## “What problems did you solve?”

I replaced Expo Router with React Navigation, removed Expo-specific APIs, moved local manga assets into the bare project, simplified the reader without losing the core reading flow, added AsyncStorage session handling, and configured Android Gradle signing so the app can build a release AAB.

## “What is the difference between Expo and React Native CLI?”

Expo gives you a managed workflow with file-based routing, Expo packages, and EAS build conveniences. React Native CLI gives direct access to native Android and iOS projects, so you manage Gradle, package names, signing, target SDKs, and native dependencies yourself. Expo is faster for prototypes; bare CLI gives more native control.

## “Why did you port only 3 screens?”

Because the goal was to demonstrate the core user journey and native React Native workflow, not copy every experiment from the Expo prototype. Keeping the port small made the architecture easier to reason about and reduced migration risk.

## “How did you use AI tools responsibly?”

I used AI as a coding assistant, but I verified the actual codebase, kept the scope narrow, avoided inventing features, checked TypeScript and lint, built the Android release bundle, and inspected native configuration. I treated AI output as something to validate, not blindly trust.

