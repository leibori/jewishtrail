
const siteList = document.querySelector('#site-list');
const form = document.querySelector('#add-site-form');
const user_id = sessionStorage.getItem('user_id');
// console.log(user_id)

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
        db.collection('Sites').doc(id).delete();
    });
}

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('Sites').add({
        name: form.name.value,
        city: form.city.value,
        // coordinates:  form.coordinates.value,
        // image: form.image.value,
        information: form.information.value
    });
    form.name.value = '';
    form.city.value = '';
    // form.coordinates.value = '';
    // form.image.value = null;
    form.information.value = '';
});

// real-time listener
db.collection('Sites').onSnapshot(snapshot => {
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


// function googleLogout(){
//     firebase.auth().signOut().then(function () {
//         console.log('User signed out.');
//         window.location = 'index.html';
//     });   
// }
