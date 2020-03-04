
const siteList = document.querySelector('#site-list');
const form = document.querySelector('#add-site-form');
const user_id = sessionStorage.getItem('user_id');
console.log(user_id)

// auth.onAuthStateChanged(user => {
//     if(user) {
//         user.getIdTokenResult().then(idTokenResult => {
//             user.admin = idTokenResult.claims.admin;
//             setupUI(user);
//         })
//         db.collection('accounts').onSnapshot(snapshot => {
//         })
//     }
// })

// create element & render 
function renderSite(doc){
    let li = document.createElement('li');
    let user_uid = document.createElement('span');
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

// saving data
// form.addEventListener('submit', (e) => {
//     console.log("here")
//     e.preventDefault();
//     db.collection('data collection').add({
//         name: form.name.value,
//         city: form.city.value,
//         user_uid:  user_id
//     });
//     form.name.value = '';
//     form.city.value = '';
// });

// real-time listener
db.collection('data collection').where('user_uid','==',user_id).onSnapshot(snapshot => {
// db.collection('data collection').where({user_uid:user_id}).onSnapshot(snapshot => {
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
});


function logout(){
    firebase.auth().signOut().then(function () {
        console.log('User signed out.');
        window.location = 'index.html';
    });   
}