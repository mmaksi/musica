import firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCryzxYtLIQR3If6TRAiKnONY9RTqZIMrc',
  authDomain: 'music-vue-js.firebaseapp.com',
  projectId: 'music-vue-js',
  storageBucket: 'music-vue-js.appspot.com',
  messagingSenderId: '890532266316',
  appId: '1:890532266316:web:f0578f371d807e30800fe9'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const { createUserWithEmailAndPassword } = firebase.auth()

export async function createUser(email, password) {
  try {
    const userCreds = await createUserWithEmailAndPassword(email, password)
    return userCreds
  } catch (error) {
    return error
  }
}
