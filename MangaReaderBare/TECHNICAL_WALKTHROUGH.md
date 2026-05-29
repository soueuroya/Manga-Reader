# Technical Walkthrough

## What The App Does

MangaReader is a React Native manga reader demo. The user signs in with Google, lands on a manga library screen, chooses a manga, and reads bundled manga page images in a reader screen.

There are two related projects:

- Expo project: `C:\Users\danie\Documents\GitHub\MangaReader\MangaReader`
- Bare React Native CLI project: `C:\Users\danie\Documents\GitHub\Manga-Reader\MangaReaderBare`

The Expo project is the fuller prototype. It includes file-based routing, tabs, themes, Google sign-in, profile state, reader settings, legal/policy content, and several UI experiments.

The bare React Native CLI project is intentionally smaller. It ports only the core app flow needed for an interview-ready native React Native demo:

1. Login
2. Manga selection / library
3. Reader

The goal was not to copy every Expo feature. The goal was to show the same product path running in a bare CLI app with explicit navigation, native Android configuration, Google Sign-In, safe-area handling, release signing, and a Google Play-ready Android App Bundle.

## High-Level App Flow

### Login Flow

The app starts in `App.tsx`, which wraps the UI in `SafeAreaProvider`, sets the status bar, and renders `AppNavigator`.

`AppNavigator.tsx` configures Google Sign-In and checks `authService.getStoredSession()` from AsyncStorage. If there is a valid stored session, the first screen is `Library`; otherwise, the first screen is `Login`.

`LoginScreen.tsx` shows the app branding and a Google login button. Pressing it calls `signInWithGoogle()`, opens the native Google account picker, stores the returned account data, and navigates to `Library`.

The stored session includes:

- user id
- email
- display name
- profile photo URL
- Google ID token when available

### Manga Selection / Library Flow

`MangaSelectionScreen.tsx` loads manga data through `mangaService.getMangas()`.

The screen includes:

- loading state
- error state
- retry button
- manga cards
- signed-in user name
- signed-in user email
- profile picture or fallback initial
- sign out button

When the user taps a manga, React Navigation opens the reader:

```ts
navigation.navigate('Reader', {mangaId: item.id});
```

Signing out calls `signOutFromGoogle()`, clears the stored session, and returns to `Login`.

### Reader Flow

`ReaderScreen.tsx` receives `mangaId` from route params. It loads:

- selected manga with `getMangaById(mangaId)`
- chapters with `getChaptersByManga(mangaId)`
- pages with `getPagesByChapter(chapterId)`

The first chapter is selected by default. Pages are rendered in a vertical `FlatList` using `ReaderPage`, which displays each image with React Native's built-in `Image`.

The reader includes basic loading/error states and a Back button so the user can return to the library.

### Navigation Between Screens

The bare app uses React Navigation:

- `Login`
- `Library`
- `Reader`
- `Legal`

The project originally used native stack navigation, but it was changed to the JavaScript stack from `@react-navigation/stack` after an Android runtime crash in `react-native-screens`. Route params are typed in `src/types/manga.ts`.

# Expo vs Bare CLI Comparison

## Expo Project Architecture

Important Expo files and folders:

- `app/_layout.tsx`: root Expo Router layout, providers, fonts, splash screen, and route declarations.
- `app/login.tsx`: Expo login screen.
- `app/(tabs)/index.tsx`: main home/library style screen.
- `app/reader/[id].tsx`: full reader screen.
- `src/context/AuthContext.tsx`: auth state and Google sign-in flow.
- `src/auth/googleAuth.native.ts`: native Google auth implementation.
- `src/auth/localAuthStorage.ts`: local auth persistence.
- `src/data/db.ts`: local manga, mangaka, chapter, and page data.
- `src/data/mangaMockData.ts`: screen-facing manga helpers.
- `constants/theme.ts` and `src/context/ThemeContext.tsx`: theme system.

### How Routing Works In Expo

The Expo app uses `expo-router`. File paths become routes:

- `app/login.tsx` becomes `/login`
- `app/(tabs)/index.tsx` becomes the main tab route
- `app/reader/[id].tsx` becomes `/reader/:id`
- `app/manga/[id].tsx` becomes `/manga/:id`

Navigation happens with `useRouter()`:

```ts
router.replace('/(tabs)');
router.push(`/reader/${item.id}`);
router.back();
```

### How Auth/Login Works In Expo

The definitive Expo project uses simple Google login through `@react-native-google-signin/google-signin`. It does not use Firebase or another authentication layer.

The auth logic is organized around:

- `src/context/AuthContext.tsx`
- `src/auth/googleAuth.native.ts`
- `src/auth/localAuthStorage.ts`

The context configures Google Sign-In, stores user/token data locally, exposes sign-in and sign-out methods, and makes the current user available to the app.

### How Manga Data Is Loaded In Expo

The clean local data source is `src/data/db.ts`. It defines:

- `MANGAKAS`
- `MANGAS`
- `CHAPTERS`
- `PAGES`
- async helpers like `db.getMangas()`, `db.getChaptersByManga()`, and `db.getPagesByChapter()`

Images are statically imported with `require(...)` so Metro can bundle local assets.

### How The Expo Reader Displays Pages

`app/reader/[id].tsx` is a larger reader implementation. It supports route param lookup, manga lookup, chapter/page loading, reading progress, reading direction settings, page controls, reader settings, AsyncStorage preferences, and Expo-specific visual tools.

That implementation is more complete, but it is larger than needed for the focused CLI port.

### Expo-Specific Tools/APIs Used

The Expo project uses tools that were intentionally not ported directly:

- `expo-router`
- `expo-image`
- `expo-blur`
- `expo-font`
- `expo-splash-screen`
- `expo-status-bar`
- `@expo/vector-icons`
- Expo app config in `app.json`
- EAS config in `eas.json`

## Bare React Native CLI Project Architecture

Important bare CLI files:

- `App.tsx`: minimal app root with safe-area provider and status bar.
- `index.js`: imports `react-native-gesture-handler` before registering the app.
- `src/navigation/AppNavigator.tsx`: React Navigation stack setup.
- `src/screens/LoginScreen.tsx`: Google login flow.
- `src/screens/MangaSelectionScreen.tsx`: library screen with profile display and logout.
- `src/screens/ReaderScreen.tsx`: page reader.
- `src/screens/LegalScreen.tsx`: Terms and Privacy screen.
- `src/components/MangaCard.tsx`: reusable library card.
- `src/components/ReaderPage.tsx`: reusable page image renderer.
- `src/services/authService.ts`: Google Sign-In plus AsyncStorage session persistence.
- `src/services/mangaService.ts`: local manga, chapters, pages, and async helpers.
- `src/types/manga.ts`: route and data types.
- `patches/react-native-screens+3.31.1.patch`: persistent native dependency crash fix.
- `android/app/build.gradle`: Android app ID, version, signing, and release config.
- `android/gradle.properties`: Android/React Native build flags.

### How React Navigation Replaces Expo Router

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

This makes the flow easy to explain because every route and param is visible in one place.

### How Login/Session Is Handled

The bare CLI app uses the same simple Google Sign-In idea as the Expo project: Google account login without Firebase.

`authService.ts` configures:

```ts
GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  scopes: ['profile', 'email'],
  offlineAccess: false,
});
```

After login, it stores a small `UserSession` in AsyncStorage. On app boot, `AppNavigator.tsx` reads that session to decide whether to show `Login` or `Library`.

### How Manga Data Is Loaded

`mangaService.ts` contains a small subset of the Expo data model:

- manga entries
- chapter entries
- statically required cover images
- statically required page images
- Promise-based helper functions

The service layer keeps data access separate from UI components and makes loading/error states easy to test.

### How Images/Pages Are Rendered

The bare app uses React Native's built-in `Image` component instead of `expo-image`.

`ReaderPage.tsx` calculates a responsive page width and displays local bundled images with `resizeMode="contain"`.

### Safe Area Handling

The CLI project uses `react-native-safe-area-context`. `App.tsx` provides `SafeAreaProvider`, and the main screens use `SafeAreaView` with all edges:

```tsx
edges={['top', 'right', 'bottom', 'left']}
```

This prevents the login, library, reader, and legal screens from overlapping status bars, navigation bars, and device cutouts.

### Android Native Structure

The bare project owns the native Android folder directly:

- `android/app/build.gradle`
- `android/build.gradle`
- `android/gradle.properties`
- `android/app/src/main/AndroidManifest.xml`
- Kotlin files under `android/app/src/main/java/...`
- launcher icons under `android/app/src/main/res/mipmap-*`

The current Play package name is:

```gradle
applicationId "com.boldreams.mangareadercli"
```

The current release version is:

```gradle
versionCode 7
versionName "1.6"
```

Release signing is configured through local ignored files:

- `android/keystores/mangareader-upload-key.jks`
- `android/signing.properties`

Those files must be backed up securely and must not be committed.

## Key Differences Between Expo And Bare CLI

### Routing

Expo uses filesystem routes with `expo-router`. The bare CLI app uses explicit React Navigation routes in `AppNavigator.tsx`.

### Native Folders

Expo abstracts most native setup unless using prebuild/eject. Bare CLI exposes Android and iOS folders from the start, so package names, signing, Gradle config, icons, and native dependencies are managed directly.

### Build And Deployment Workflow

Expo commonly uses Expo tooling and EAS builds.

Bare CLI uses Gradle directly:

```bash
cd android
.\gradlew.bat bundleRelease
```

The generated AAB is:

```txt
android/app/build/outputs/bundle/release/app-release.aab
```

The latest successful AAB build was version `1.6` with `versionCode 7`.

### Android Gradle Setup

In bare CLI, `android/app/build.gradle` controls:

- `namespace`
- `applicationId`
- `versionCode`
- `versionName`
- `signingConfigs`
- `buildTypes`
- release minification

This matters for Google Play because the bundle must use the exact package name `com.boldreams.mangareadercli`.

### Image Rendering

Expo used `expo-image`. The bare app uses React Native `Image` to avoid Expo-specific APIs.

### Storage/Session Handling

Expo stores auth state through its auth context and storage helpers. The bare app stores a smaller `UserSession` directly through AsyncStorage in `authService.ts`.

### Dependency Management

Expo packages are usually installed through Expo-compatible versions. Bare CLI dependencies are installed directly and need native compatibility.

Current important CLI dependencies include:

- `@react-native-async-storage/async-storage`
- `@react-native-google-signin/google-signin`
- `@react-navigation/native`
- `@react-navigation/stack`
- `react-native-gesture-handler`
- `react-native-safe-area-context`
- `react-native-screens`
- `patch-package`

### Google Play Release Process

The bare project needs manual release setup:

- correct package name
- target SDK
- version increment
- upload keystore
- signed App Bundle
- Play Console privacy/data safety/store listing
- Google OAuth client configuration for release and Play App Signing SHA-1 values

# Challenges Solved

## 1. Replacing `expo-router` With React Navigation

Issue: The Expo app used file-based routing, but bare React Native CLI does not include `expo-router`.

Why it matters: Login, library, reader, and legal screens need reliable navigation.

How it worked in Expo: Routes came from files like `app/login.tsx`, `app/(tabs)/index.tsx`, and `app/reader/[id].tsx`.

How it needed to work in bare CLI: Routes had to be declared manually and typed.

Solution implemented: Added `src/navigation/AppNavigator.tsx` and `RootStackParamList` in `src/types/manga.ts`.

## 2. Moving From Native Stack To JS Stack

Issue: The Android app crashed with a native `react-native-screens` error:

```txt
java.lang.NoSuchMethodError: No interface method removeLast()
```

Why it matters: The app could build but crashed at runtime with "MangaReader keeps stopping."

How it worked in Expo: Expo's managed runtime and dependency versions avoided this exact native crash path.

How it needed to work in bare CLI: The native dependency had to work on the emulator/device and survive reinstalls.

Solution implemented: Switched navigation to `@react-navigation/stack`, added `react-native-gesture-handler`, and added a persistent `patch-package` patch for `react-native-screens@3.31.1`.

## 3. Replacing Expo-Specific APIs

Issue: The Expo app used `expo-router`, `expo-image`, `expo-blur`, `expo-font`, `expo-splash-screen`, and other Expo APIs.

Why it matters: The CLI app should not depend on Expo-specific runtime APIs.

How it worked in Expo: Expo packages handled routing, images, fonts, splash screen, status bar, and visual effects.

How it needed to work in bare CLI: The app needed standard React Native and CLI-compatible packages.

Solution implemented: Used React Navigation, React Native `Image`, React Native `StatusBar`, and simpler UI.

## 4. Adding Real Google Sign-In Without Firebase

Issue: The first CLI version used a mocked test login, but the target Expo app used simple Google login.

Why it matters: The CLI app should allow login with a real Google email and show profile data.

How it worked in Expo: `AuthContext` called native Google Sign-In helpers and stored the user locally.

How it needed to work in bare CLI: Google Sign-In needed native Android configuration, a web client ID, AsyncStorage persistence, and sign-out.

Solution implemented: Added `@react-native-google-signin/google-signin`, configured it in `authService.ts`, stored `UserSession`, displayed the profile picture/name/email in the library, and added logout.

## 5. Handling Google `DEVELOPER_ERROR`

Issue: Google Sign-In returned `DEVELOPER_ERROR`.

Why it matters: Google rejects sign-in when package names and signing certificates do not match OAuth client settings.

How it worked in Expo: Expo had its own configured package/signing setup.

How it needed to work in bare CLI: Google Cloud needed Android OAuth clients for `com.boldreams.mangareadercli` with the correct SHA-1 fingerprints.

Solution identified: Configure Google Cloud/Play Console OAuth entries for:

- debug SHA-1
- upload/release SHA-1
- Play App Signing SHA-1 after the app is created in Play Console

## 6. Handling Local Manga/Page Assets

Issue: The reader needs page images to render.

Why it matters: Metro requires static `require(...)` calls for bundled local images.

How it worked in Expo: `src/data/db.ts` statically required many local images.

How it needed to work in bare CLI: The bare app needed its own copied assets and explicit static requires.

Solution implemented: Copied the needed manga assets and created `mangaService.ts` with static image references.

## 7. Safe Area Support

Issue: The CLI app was not respecting safe screen areas.

Why it matters: UI can overlap the status bar, gesture area, or device cutout.

How it worked in Expo: Expo templates and layout helpers often hide some of this complexity.

How it needed to work in bare CLI: Safe-area support had to be added explicitly.

Solution implemented: Added `SafeAreaProvider` at the app root and `SafeAreaView` in the main screens.

## 8. Android Build, Signing, And Release Versioning

Issue: Google Play requires a signed AAB with the correct package name and version.

Why it matters: Uploads fail if package name, signing, or versioning is wrong.

How it worked in Expo: EAS can manage credentials and build artifacts.

How it needed to work in bare CLI: Gradle had to be configured directly.

Solution implemented: Set `applicationId "com.boldreams.mangareadercli"`, configured release signing, copied icons/policy assets where needed, enabled release bundling, and generated a signed AAB.

The current rule is: every successful release build increments the Android version by 1. The latest successful build is:

- `versionCode 7`
- `versionName "1.6"`
- AAB path: `android/app/build/outputs/bundle/release/app-release.aab`

## 9. Keeping The Project Interview-Friendly

Issue: The Expo app contains many features and experiments that would make a full migration noisy.

Why it matters: In an interview, a small coherent architecture is easier to explain than a large partial port.

How it worked in Expo: The app includes tabs, themes, profile state, reader settings, legal screens, and many UI experiments.

How it needed to work in bare CLI: The demo should prove the essential app path and native workflow.

Solution implemented: The CLI app uses a focused `src/` structure: navigation, screens, components, services, and types.

# Interview Demo Plan

## Files To Open And Explain

1. `App.tsx`

Show the small app root, `SafeAreaProvider`, status bar, and navigator.

2. `index.js`

Show `react-native-gesture-handler` being imported before the app is registered.

3. `src/navigation/AppNavigator.tsx`

Explain React Navigation, startup session check, and route declarations.

4. `src/types/manga.ts`

Show typed route params and shared domain types.

5. `src/screens/LoginScreen.tsx`

Explain Google login, loading/error state, and legal links.

6. `src/services/authService.ts`

Show Google Sign-In configuration, AsyncStorage session persistence, and logout.

7. `src/screens/MangaSelectionScreen.tsx`

Show async data loading, profile picture/name/email, logout, error handling, and navigation to reader.

8. `src/components/MangaCard.tsx`

Show the reusable library card.

9. `src/screens/ReaderScreen.tsx`

Explain route params, manga/chapter/page loading, error states, and vertical page list.

10. `src/components/ReaderPage.tsx`

Show local image rendering with React Native `Image`.

11. `src/services/mangaService.ts`

Explain the local data layer and static image requires.

12. `patches/react-native-screens+3.31.1.patch`

Explain the runtime crash fix and why `patch-package` is used.

13. `android/app/build.gradle`

Show package name, version, signing config, minification, and release build setup.

14. `android/gradle.properties`

Show AndroidX, Hermes, architecture config, and build flags.

## Demo Sequence

1. Start at `App.tsx`.
2. Open `AppNavigator.tsx` and explain the routes.
3. Open `LoginScreen.tsx` and `authService.ts`.
4. Open `MangaSelectionScreen.tsx` and `mangaService.ts`.
5. Open `ReaderScreen.tsx` and `ReaderPage.tsx`.
6. Open the patch file and explain the Android crash fix.
7. Open `android/app/build.gradle` to show native release readiness.
8. Mention the generated AAB path:

```txt
android/app/build/outputs/bundle/release/app-release.aab
```

## Build Commands To Mention

```bash
npm run lint
npx tsc --noEmit
cd android
.\gradlew.bat bundleRelease
```

## Honest Limitations

- Google Sign-In requires correct OAuth clients and SHA-1 fingerprints in Google Cloud/Play Console.
- The bare app only ports the core reader flow, not the full Expo app.
- The reader is vertical-only and does not include the Expo reader's advanced settings.
- No remote backend/API is connected.
- Play Console tasks like store listing, screenshots, hosted privacy URL, data safety form, and content rating still happen outside the codebase.
- The upload keystore exists locally and must be backed up securely.

# Short Talking Points

## "What does the project do?"

It is a manga reader demo. A user signs in with Google, sees their account info, browses a local manga library, selects a manga, and reads chapter pages rendered from bundled image assets.

## "What part did you work on?"

I ported the core product flow from a larger Expo prototype into a clean bare React Native CLI app. I focused on login, library selection, reader navigation, local manga data, page rendering, Android safe areas, Google Sign-In, and release readiness.

## "What code did you write?"

I wrote the bare app structure under `src/`: the React Navigation stack, login screen, library screen, reader screen, reusable card/page components, Google auth service, manga data service, and TypeScript route/domain types. I also configured Android package name, versioning, signing, icons, and release bundle generation.

## "What problems did you solve?"

I replaced Expo Router with React Navigation, removed Expo-specific APIs, added Google Sign-In without Firebase, handled AsyncStorage-backed sessions, fixed safe-area issues, patched a native Android crash in `react-native-screens`, and configured Gradle signing so the app can build a release AAB.

## "What is the difference between Expo and React Native CLI?"

Expo gives a managed workflow with file-based routing, Expo packages, and EAS build conveniences. React Native CLI gives direct access to native Android and iOS projects, so package names, signing, Gradle config, target SDKs, and native dependencies are managed directly.

## "Why did you port only 3 screens?"

Because the goal was to demonstrate the core user journey and native React Native workflow, not copy every experiment from the Expo prototype. Keeping the port small made the architecture easier to reason about and reduced migration risk.

## "How did you use AI tools responsibly?"

I used AI as a coding assistant, but I verified the actual codebase, kept the scope narrow, avoided inventing features, checked TypeScript and lint, ran Android builds, inspected logcat for crashes, and validated native configuration before calling the work done.
