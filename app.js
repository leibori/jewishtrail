
const siteList = document.querySelector('#site-list');
//const form = document.querySelector('#add-site-form');

// create element & render 
/* function renderSite(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    siteList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('data collection').doc(id).delete();
    });
}
 */
// getting data
// db.collection('cafes').orderBy('city').get().then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     });
// });

// saving data

/* form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('data collection').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
});
 */
// real-time listener
/* db.collection('data collection').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            renderSite(change.doc);
        } else if (change.type == 'removed'){
            let li = siteList.querySelector('[data-id=' + change.doc.id + ']');
            siteList.removeChild(li);
        }
    });
}); */

/* function googleLogin3(){
    console.log("in")
    var provider = new firebase.auth.GoogleAuthProvider();
    console.log("in3")
    firebase.auth().signInWithPopup(provider).then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log("in3")
        console.log(user)
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      });
} */


function googleLogin(){
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result =>{
        const user = result.user;
        console.log(user.email);
        const userUid = user.uid;
        const displayName = user.displayName;
        const account = {
            useruid: userUid,
            displayName: displayName,
            calendarEvents: []
        }

        firebase.firestore().collection('accounts').add(account); 

    }). catch(console.log)


}


//Handle Account Status
firebase.auth().onAuthStateChanged(user => {
    if(user) {
      sessionStorage.setItem('user_id', user.uid)
      console.log(user.uid)  
      window.location = 'home.html'; //After successful login, user will be redirected to home.html
    }
  });


// updating records (console demo)
// db.collection('cafes').doc('DOgwUvtEQbjZohQNIeMr').update({
//     name: 'mario world'
// });

// db.collection('cafes').doc('DOgwUvtEQbjZohQNIeMr').update({
//     city: 'hong kong'
// });

// setting data
// db.collection('cafes').doc('DOgwUvtEQbjZohQNIeMr').set({
//     city: 'hong kong'
// });  
