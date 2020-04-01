import  app from 'firebase/app';
import "firebase/auth"
import "firebase/firebase-firestore"
import "firebase/functions"

var config = {
    apiKey: "AIzaSyDxnwrW4yBF4d0QDXoFSCF9FBNDauq68gE",
    authDomain: "jewish-trail.firebaseapp.com",
    databaseURL: "https://jewish-trail.firebaseio.com",
    projectId: "jewish-trail",
    storageBucket: "jewish-trail.appspot.com",
    messagingSenderId: "1060927552672",
    appId: "1:1060927552672:web:7288a483d83a16b7da9dc5",
    measurementId: "G-D4K9DSRZ0K"
};

export const myFirebase = app.initializeApp(config);
export const myDatabase = myFirebase.firestore();
export const myFunctions = myFirebase.functions()



// export default class Firebase{

//     // static sharedInstance = Firebase.sharedInstance == null ? new Firebase() : Firebase.sharedInstance

//     static instance = null;
//     static createInstance() {
//         var object = new Firebase();
//         return object;
//     }
//     static getInstance () {
//         if (!Firebase.instance) {
//             Firebase.instance = Firebase.createInstance();
//         }
//         return Firebase.instance;
//     }

//     constructor(){
//         app.initializeApp(config)
//         this.auth = app.auth()
//         this.db = app.firestore()
//         this.user = null
//         this.startStateListiner()
//         console.log("in constructor")
//         console.log("val = " + this.user)    
//     }

//     // declare functions here 
//     loginWithGoogle() {
//         const provider = this.auth.GoogleAuthProvider();
//         return this.auth().signInWithPopup(provider).then(result =>{
//             const user = result.user;
//             console.log(user.email);
//         })
//     }

//     async register(email,password){
//         await this.auth.createUserWithEmailAndPassword(email,password)
//         return this.auth.currentUser
//     }
//     login(email,password){
//         this.auth.signInWithEmailAndPassword(email,password)
//         this.user = this.auth.currentUser.uid
//     }

//     async getUserClaims(){
//         return this.user
//     }

//     // async statusListener(){
//     //     this.auth.onAuthStateChanged(user => {
//     //         user.getIdTokenResult().then(idTokenResult => {
//     //             user.admin = idTokenResult.claims.admin;
//     //             console.log("Is the user and admin?" + user.admin);
//     //         });
//     //     })
//     // }

//     startStateListiner() {
//         this.auth.onAuthStateChanged(user => {
//             if(user) {
//                 this.user = user.uid
//             } else {
//                 this.user = "offline"
//             }
//             // user.getIdTokenResult().then(idTokenResult => {
//             //     user.admin = idTokenResult.claims.admin;
//             //     console.log("Is the user and admin?" + user.admin);
//             // });
//         })
//     }
// }

// // export default new Firebase()