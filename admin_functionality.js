const roadForm = document.querySelector('#add-road-form');
const deleteRoad = document.querySelector('#delete-road-form');
//const changeRoad = document.querySelector('#change-road-form');



roadForm.addEventListener('submit',(e)=>{
    e.preventDefault();
	console.log("here");
    console.log(roadForm['site-name'].value);
    console.log(roadForm['site-city'].value);
    console.log(roadForm['site-country'].value);
	db.collection('sites').add({
		name: roadForm['site-name'].value,
		city: roadForm['site-city'].value,
		country: roadForm['site-country'].value,
	}).then(() => {
	// reset form
        roadForm.reset();
		roadForm.querySelector('.error').innerHTML = ''
    }).catch(err => {
		roadForm.querySelector('.error').innerHTML = err.message;
	});
});

// delete site by name.
deleteRoad.addEventListener('submit',(e)=>{
    e.preventDefault();
    var roadName = deleteRoad['site-name-delete'].value;
    console.log(roadName)
	// search site by name.
	db.collection('sites').where('name','==',roadName).get().then(snapshot =>{
		if(snapshot){
			snapshot.forEach(doc => {
                db.collection('sites').doc(doc.id).delete();
                console.log(doc.id);
            });
		}
	}).catch(err => {
		deleteRoad.querySelector('.error').innerHTML = err.message;
	});
});

// changeRoad.addEventListener('submit',(e) =>{
// 	var roadName = roadForm['site-name'].value;
// });




// const siteList = document.querySelector('#site-list');
// const form = document.querySelector('#add-site-form');
// const user_id = sessionStorage.getItem('user_id');
// // console.log(user_id)

// // create element & render 
// function renderSite(doc){
//     let li = document.createElement('li');
//     let user_uid = document.createElement('span');
//     let name = document.createElement('span');
//     let city = document.createElement('span');
//     let cross = document.createElement('div');

//     li.setAttribute('data-id', doc.id);
//     name.textContent = doc.data().name;
//     city.textContent = doc.data().city;
//     cross.textContent = 'x';

//     li.appendChild(name);
//     li.appendChild(city);
//     li.appendChild(cross);

//     siteList.appendChild(li);

//     // deleting data
//     cross.addEventListener('click', (e) => {
//         e.stopPropagation();
//         let id = e.target.parentElement.getAttribute('data-id');
//         db.collection('Sites').doc(id).delete();
//     });
// }

// // saving data
// form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     db.collection('Sites').add({
//         name: form.name.value,
//         city: form.city.value,
//         // coordinates:  form.coordinates.value,
//         // image: form.image.value,
//         information: form.information.value
//     });
//     form.name.value = '';
//     form.city.value = '';
//     // form.coordinates.value = '';
//     // form.image.value = null;
//     form.information.value = '';
// });

// // real-time listener
// db.collection('Sites').onSnapshot(snapshot => {
//     let changes = snapshot.docChanges();
//     changes.forEach(change => {
//         console.log(change.doc.data());
//         if(change.type == 'added'){
//             renderSite(change.doc);
//         } else if (change.type == 'removed'){
//             let li = siteList.querySelector('[data-id=' + change.doc.id + ']');
//             siteList.removeChild(li);
//         }
//     });
// });


// // function googleLogout(){
// //     firebase.auth().signOut().then(function () {
// //         console.log('User signed out.');
// //         window.location = 'index.html';
// //     });   
// // }
