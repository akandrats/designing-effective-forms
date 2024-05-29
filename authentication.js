import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "tpf-pk-a80fa.firebaseapp.com",
  projectId: "tpf-pk-a80fa",
  storageBucket: "tpf-pk-a80fa.appspot.com",
  messagingSenderId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/plus.login');

document.addEventListener("DOMContentLoaded", () => {
  const signInButton = document.querySelector("#signInButton");
  const signOutButton = document.querySelector("#signOutButton");

  const userSignIn = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {

        const user = result.user;
        console.log(user);

		const token = user.accessToken;

		localStorage.setItem('userToken', token);

		const [firstName, ...lastName] = user.displayName.split(' ');
		document.getElementById('firstName').value = firstName;
		document.getElementById('lastName').value = lastName.join(' ');
		document.getElementById('email').value = user.email;

		document.getElementById('errorMessage').textContent = '';

		console.log('User signed in:', user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
		document.getElementById('errorMessage').style.display = 'block';
		document.getElementById('errorMessage').textContent = `Error ${errorCode}: ${errorMessage}`;
        console.error(`Error ${errorCode}: ${errorMessage}`);
      });
  };

  const userSignOut = async () => {
    signOut(auth)
      .then(() => {
        alert("You have been signed out!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error ${errorCode}: ${errorMessage}`);
      });
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      alert("You are authenticated with Google");
      console.log(user);
    }
  });

  if (signInButton) signInButton.addEventListener("click", userSignIn);
  if (signOutButton) signOutButton.addEventListener("click", userSignOut);
});