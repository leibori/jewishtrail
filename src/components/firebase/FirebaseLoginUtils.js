import * as firebase from 'firebase'
import { myFirebase, myDatabase } from './firebase'


export async function signInWithGoogle() {

  var provider = new firebase.auth.GoogleAuthProvider();
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  await firebase.auth().signInWithPopup(provider)
  // add createNewAccout
  var user = myFirebase.auth().currentUser;
  if(await isUserExists(user.uid)){
    return user
  }
  var displayName = user.displayName;
  CreateNewAccount(user.uid, displayName).then((u)=>(console.log(u)));
  return user
}

async function isUserExists(uid){
  const user = await myDatabase.collection('accounts').doc(uid).get()
  if(user.exists){
    return true;
  }
  return false;
}

export async function login(e, email, password) {
    e.preventDefault();
    
    const user = await myFirebase.auth().signInWithEmailAndPassword(email, password).then((u) => {
      console.log(u.user)
      return u.user
    }).catch((error) => {
      alert("Invalid email or password. Please try again.");
      return null
    });

    return user
}

export async function signup(e, email, password, user_name){
  e.preventDefault();
  myFirebase.auth().createUserWithEmailAndPassword(email, password).then((u)=>{
    CreateNewAccount(u.user.uid, user_name)
  }).then((u)=>{console.log(u)})
  .catch((error) => {
    alert(error);
  })
}

async function CreateNewAccount(uid, UserName){
  await myDatabase.collection("accounts").doc(uid).set({
      user_name: UserName,
      favorites: [],
      RoadsFavorites: [],
  })
}