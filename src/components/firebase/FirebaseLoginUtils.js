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
      return null
    });
    return user
}

export async function signup(e, email, password, user_name){
  e.preventDefault();
  await myFirebase.auth().createUserWithEmailAndPassword(email, password).then(u=>emailAuthentication(u))
  .then((u)=>CreateNewAccount(u.user.uid, user_name))
  .then((u)=>{console.log(u)})
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

export const forgotPassword = async(email) => {
  if(email != ""){
        myFirebase.auth().sendPasswordResetEmail(email).then(() => alert("Email has been sent"));
    };
}

export const emailAuthentication = async(u) => {
  const user = firebase.auth().currentUser;
  console.log(user)
  if (!user){
    alert(user)
    return;
  }
  user.sendEmailVerification().then(function() {
        alert("Verification email was successfully sent.")
      }).catch(function(error) {
        alert("An error has occured, please try again.")
      });
  return u;
  }