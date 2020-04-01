import * as firebase from 'firebase'
import { myFirebase, myDatabase } from './firebase'

export async function signInWithGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  await firebase.auth().signInWithPopup(provider)
  return myFirebase.auth().currentUser.uid
}

export function login(e, email, password) {
    e.preventDefault();
    myFirebase.auth().signInWithEmailAndPassword(email, password).then((u)=>{
      console.log("logged in" + myFirebase.auth().currentUser)
    }).catch((error) => {
        console.log(error);
      });
}

export async function signup(e, email, password, first_name, last_name){
  e.preventDefault();
  myFirebase.auth().createUserWithEmailAndPassword(email, password).then((u)=>{
    CreateNewAccount(u.user.uid, first_name, last_name)
  }).then((u)=>{console.log(u)})
  .catch((error) => {
      console.log(error);
  })
}

async function CreateNewAccount(uid, FirstName, LastName){
  console.log(uid)
  await myDatabase.collection("accounts").doc(uid).set({
      first_name: FirstName,
      last_name: LastName,
      favorites: []
  })
}