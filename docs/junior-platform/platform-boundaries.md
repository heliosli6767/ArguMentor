# Platform boundaries

## Web

`apps/junior` remains the reference experience and private hosted Site. Browser speech recognition is an optional adapter; recorded transcription is a server call. Browser storage remains available for account-free practice.

## WeChat Mini Program

Use native WXML/WXSS for startup speed and ecosystem fit. Network traffic must use an HTTPS domain registered in the WeChat console. Login begins with `wx.login`; the code must be exchanged server-side and must never be treated as identity by the client alone. Voice files are temporary and uploaded only after explicit learner action.

## iOS and Android

One Expo/React Native application supplies the shared screens. Use `.ios.ts(x)` and `.android.ts(x)` only for platform behavior such as audio permission copy, secure storage and store policy. Generate native projects with Expo prebuild only when a native dependency or store build needs them; do not hand-fork two application codebases.

## Shared UI versus shared behavior

Share contracts, curriculum identifiers, pedagogy rules, analytics names and API behavior. Reimplement visual components in each platform's native primitives. This keeps accessibility, navigation and permission behavior appropriate to the host platform.
