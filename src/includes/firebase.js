import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

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

export const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

// Selects the collection
const usersCollection = db.collection('users')
const songsCollection = db.collection('songs')
const commentsCollection = db.collection('comments')

// Create a user with email and password in firebase
export async function createUser(name, email, password) {
  try {
    const userCreds = await auth.createUserWithEmailAndPassword(email, password)
    await userCreds.user.updateProfile({
      displayName: name
    })
    return userCreds
  } catch (error) {
    return new Error(error)
  }
}

// Save to the firestore database
export async function addUser(uid, userData) {
  try {
    await usersCollection.doc(uid).set(userData)
    return true
  } catch (error) {
    return false
  }
}

export function checkCurrentUser() {
  auth.onAuthStateChanged(() => {
    const user = firebase.auth().currentUser
    return user
  })
}

export async function authenticate({ email, password }) {
  const userCreds = await auth.signInWithEmailAndPassword(email, password)
  return userCreds.user
}

export async function logoutUser() {
  await auth.signOut()
}

export function uploadToFirebase(file) {
  // References allow read/write operations. Snapshots are read-only
  const storageRef = storage.ref() // music-vue-js.appspot.com
  const songsRef = storageRef.child(`songs/${file.name}`) // music-vue-js.appspot.com/songs/${file.name}
  const task = songsRef.put(file)
  return task
}

export async function storeSongWithUser(task) {
  // Store the queried songs in a local state

  const song = {
    uid: auth.currentUser.uid,
    displayName: auth.currentUser.displayName,
    originalName: task.snapshot.ref.name,
    modifiedName: task.snapshot.ref.name,
    genre: '',
    commentCount: 0
  }
  song.url = await task.snapshot.ref.getDownloadURL()

  // Store the song with user data in firestore
  await songsCollection.add(song) // doesn't allow for setting custom document id
  const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get()
  // const addedSongDocID = snapshot[snapshot.length - 1]
  return { ...song, docID: snapshot.docs[snapshot.docs.length - 1].id }
}

export function cancelUpload(songs) {
  songs.forEach((song) => {
    const task = song.task
    task.cancel()
  })
}

export async function getUserSongs() {
  return await songsCollection.where('uid', '==', auth.currentUser.uid).get()
}

export async function editSongData(docID, values) {
  try {
    await songsCollection.doc(docID).update({ modifiedName: values.modifiedName })
  } catch (error) {
    throw new Error(error)
  }
}

export async function deleteSong(docID, originalName) {
  try {
    // Delete from Storage
    const storageRef = storage.ref()
    var songRef = storageRef.child(`songs/${originalName}`)
    await songRef.delete()
    // Delete document from firestore
    await songsCollection.doc(docID).delete()
  } catch (error) {
    throw new Error(`Failed to delete song data. Try again later.`)
  }
}

export async function getSongByDocID(docID) {
  const snapshot = await songsCollection.doc(docID).get()
  if (!snapshot.exists) {
    return null
  } else {
    return snapshot.data()
  }
}

export async function getAllSongs(compSongs, maxPerPage) {
  let querySnapshot
  if (compSongs.length) {
    const lastDoc = await getSongByDocID(compSongs[compSongs.length - 1].docID)
    querySnapshot = await songsCollection
      .orderBy('modifiedName')
      .startAfter(lastDoc)
      .limit(maxPerPage)
      .get()
  } else {
    querySnapshot = await songsCollection.orderBy('modifiedName').limit(maxPerPage).get()
  }

  const songs = []
  querySnapshot.forEach((doc) => {
    const song = { docID: doc.id, ...doc.data() }
    songs.push(song)
  })

  return songs
}

export async function addComment(values, songID, newCount) {
  const comment = {
    content: values.comment,
    datePosted: new Date().toString(),
    sid: songID,
    name: auth.currentUser.displayName,
    uid: auth.currentUser.uid
  }

  try {
    await commentsCollection.add(comment)
    await updateCommentCount(songID, newCount)
    return comment
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export async function updateCommentCount(docID, newCount) {
  try {
    await songsCollection.doc(docID).update({
      commentCount: newCount
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getAllComments(songID, comments) {
  const snapshot = await commentsCollection.where('sid', '==', songID).get()
  snapshot.forEach((document) => {
    comments.push({
      docID: document.id,
      ...document.data()
    })
  })
}
