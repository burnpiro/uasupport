![logo](./public/logo.svg)

![licence](https://badgen.net/github/license/burnpiro/uasupport)
![node](https://img.shields.io/badge/node-%3E%3D16-brightgreen)
![commits](https://badgen.net/github/commits/burnpiro/uasupport)
![node](https://img.shields.io/badge/react-%3E%3D17-orange)
![firebase](https://img.shields.io/badge/cloud-firebase-red)
![pwa](https://img.shields.io/badge/PWA-ready-brightgreen)

# UASupport

This project was built in order to help with refugee crisis regarding the Russian invasion on Ukraine. Website is available at [https://uasupport.pl](https://uasupport.pl).

All code is distributed under [GPL Licence](./LICENSE).

## How to start

### Start your application

#### Install dependencies
```bash
npm i
```

### Start
```bash
npm run start
```

__\[Before you start you have to do all the things described below\]__

### Generate Google Maps project

Go to [GCP Maps API Page](https://console.cloud.google.com/google/maps-apis/overview) and assign new API key (`Credentials` page) to your project.

There should be 2 sets of keys, first public and __domain restricted__ used on production server. The second is a dev key (restricted to localhost).

Put the first one into `./src/utils/settings.js` inside `GM_KEY` field

### Generate ReCaptcha Key

Go to [https://www.google.com/recaptcha/admin](https://www.google.com/recaptcha/admin) and generate new reCAPTCHA v2 key for your project. Copy it into `./src/utils/settings.js` inside `SITE_KEY` field.

### Generate Firebase project

First generate the firebase project using [https://console.firebase.google.com/](https://console.firebase.google.com/).

Project has to be generated as "Web App".

Copy generated `firebaseConfig` into `./src/firebase.js` file (replace existing setting because it works only on `uasupport.pl` domain)

#### Create Dev and production API Keys in google platform

[GCP Credentials](https://console.cloud.google.com/apis/credentials) stores all your API keys. The main key should be restricted only to the domain you're serving the application from. Firebase is going to create one key for you so you can use it on production. Restrict usage of that key to:

##### Application Restriction:

- HTTP referrers (web sites)

Enter your domain/domains here

##### API restrictions

- Cloud Firestore API
- Cloud Functions API
- Cloud Storage API
- Cloud Storage for Firebase API
- Firebase Installations API
- Firebase Management API
- Identity Toolkit API
- Token Service API

If you add more functionalities please add those to the API keys.

Now you can create another key for localhost usage only (dev key). Restrictions are the same only domain differs. This is mostly to prevent anyone from using your keys.

#### Add Firebase services:

- Authentication
- Firestore
- Storage
- Functions
- Analytics (optional)

Authentication service requires enabling following providers:

- Google
- Facebook
- Email/Password (legacy)
- Phone (legacy)

### Install local version of Firebase

To work in dev environment you have to create a dev version of the firebase. This is called __Firebase Emulator__ and the documentation is available here [https://firebase.google.cn/docs/emulator-suite](https://firebase.google.cn/docs/emulator-suite).

To install the emulator please execute:

```
npm i -g firebase-tools
cd cloud
firebase init
```

Now select desired emulators (you don't have to emulate everything, but it is advice to). Do not overwrite existing rules (`./cloud/firestore.rules`) or settings (`./cloud/firebase.json`).

#### Emulate the environment

```bash
# ./cloud
firebase emulators:start --import ./data
```

It should start the simulator now. It is available at [http://localhost:4001/](http://localhost:4001/). All services should be green and ready.

Now you can go to `./src/firebase` and uncomment following lines:

```javascript
// localhost firebase (it works only on emulated env)
connectFirestoreEmulator(db, 'localhost', 8081);
connectStorageEmulator(storage, 'localhost', 9199);
connectAuthEmulator(auth, 'http://localhost:9099');
connectFunctionsEmulator(functions, 'localhost', 5001);
```

this is going to use your local emulator instead of Firebase server, so you can test your application.

#### Persist your emulator state

After emulator is closed all the changes stored in there are cleaned. To prevent that and create a "basic" data you can export the current emulator state:

```bash
# ./cloud
firebase emulators:export ./data
```

## Deploy

You can deploy app from GH Pages directly (using GH Actions workflow). It will build automatically when new commits are merged into `master` branch: `.github/workflow/main.yaml`. It calls `npm run build` and copies the `build` folder as a static website.

### Deploy Firestore functions

To use the firebase functions you have to deploy them to the firebase server first:

```bash
# ./cloud
firebase deploy --only functions
```

That will apply all changes from your `./cloud/functions` folder.

### Domain

Use your domain by replacing one stored in `public/CNAME`. You can modify `index.html` and `manifest.json` as well.

## Add first admin

By default the site has no admin. Register your admin with any available login method (Google Auth). Enable `addAdminRoleOriginal` function stored in `cloud/functions/claimManagement/addAdminRole.js` and replace email address with your user's email address.

Deploy that cloud function and call it directly by accessing it through the browser. It is going to assign admin claim to the provided email address.

Comment that function and deploy it again after you're done.



