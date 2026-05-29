# Manga-Reader





workflow:



1 - npx @react-native-community/cli init MangaReaderBare --template react-native-template-typescript



2 - error with the version
Remove-Item -Recurse -Force .\\MangaReaderBare



3 - npx @react-native-community/cli@latest init MangaReaderBare --pm npm



4 - cd MangaReaderBare

npm install @react-navigation/native @react-navigation/native-stack

npm install react-native-screens react-native-safe-area-context

npm install react-native-screens react-native-safe-area-context



5 - Imported functionalities from MangaReader Expo



6 - created keystore and added SHA keys

keytool -genkeypair -v `

\-keystore mangareader-release.keystore



7 -cd MangaReaderBare

cd android

.\\gradlew bundleRelease



8 - local test with android studio

npx react-native run-android

npx react-native start



9 - safe area view error detected.
consulted AI for more details.
found issue: SafeAreaView within react-native has inconsistencies with Android.

swapped for: react-native-safe-area-context SafeAreaView



10- aab build
.\\gradlew.bat bundleRelease

updated version number



11 - Uploaded to Google Play Store



12 - internal testing setup and testers added

