import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

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

const auth = firebase.auth()
const db = firebase.firestore()

// Selects the users collection
const usersCollection = db.collection('users')

// Create a user with email and password in firebase
export async function createUser(email, password) {
  try {
    const userCreds = await auth.createUserWithEmailAndPassword(email, password)
    return userCreds
  } catch (error) {
    return new Error(error)
  }
}

// Save to the firestore database
export async function addUser(userData) {
  try {
    await usersCollection.add(userData)
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
