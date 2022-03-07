import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAuth,
  linkWithCredential,
  OAuthProvider,
  signInWithCredential,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

export async function sighInWithFB({ errorCredential }) {
  const provider = new FacebookAuthProvider();
  provider.addScope('public_profile');
  provider.addScope('email');
  provider.addScope('user_link');
  const auth = getAuth();
  try {
    const result = await signInWithPopup(auth, provider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;

    if (errorCredential != null) {
      const linkResult = await linkWithCredential(user, errorCredential);

      const linkCredential = OAuthProvider.credentialFromResult(linkResult);
      const autoSignResult = await signInWithCredential(auth, linkCredential);

      return {
        status: 200,
        user: autoSignResult.user
      };
    }

    return {
      status: 200,
      user,
      token
    };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    console.error(errorCode, errorMessage, email);
    const credential = FacebookAuthProvider.credentialFromError(error);

    return {
      status: 400,
      code: errorCode,
      message: errorMessage,
      credential
    };
  }
}

export async function sighInWithGoogle({ errorCredential }) {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  const auth = getAuth();
  try {
    const result = await signInWithPopup(auth, provider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;

    if (errorCredential != null) {
      const linkResult = await linkWithCredential(user, errorCredential);

      const linkCredential = OAuthProvider.credentialFromResult(linkResult);
      const autoSignResult = await signInWithCredential(auth, linkCredential);

      return {
        status: 200,
        user: autoSignResult.user
      };
    }

    return {
      status: 200,
      user
    };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    console.error(errorCode, errorMessage, email);
    const credential = GoogleAuthProvider.credentialFromError(error);

    return {
      status: 400,
      code: errorCode,
      message: errorMessage,
      credential
    };
  }
}

export async function createUserAccount({ email, password }) {
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
      status: 200,
      user
    };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(error);
    return {
      status: 400,
      code: errorCode,
      message: errorMessage
    };
  }
}

export async function signInStandard({ email, password, errorCredential }) {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (errorCredential != null) {
      const linkResult = await linkWithCredential(user, errorCredential);

      const linkCredential = OAuthProvider.credentialFromResult(linkResult);
      const autoSignResult = await signInWithCredential(auth, linkCredential);

      return {
        status: 200,
        user: autoSignResult.user
      };
    }

    return {
      status: 200,
      user
    };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    return {
      status: 400,
      code: errorCode,
      message: errorMessage
    };
  }
}

export async function resetPassword(
  { email },
  actionCodeSettings = {
    url: 'https://uasupport.pl/#/login',
    handleCodeInApp: false
  }
) {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);

    return {
      status: 200
    };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    return {
      status: 400,
      code: errorCode,
      message: errorMessage
    };
  }
}
