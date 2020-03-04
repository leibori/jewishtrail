const user_id = sessionStorage.getItem('user_id');

// const adminItems = document.querySelectorAll('.admin');
// const loggedInLinks = document.querySelectorAll('.logged-in');

// const setupUI = (user) => {
//     if (user) {
//         console.log("logged in");
//       if (user.admin) {
//         adminItems.forEach(item => item.style.display = 'block');
//       }
//       // toggle user UI elements 
//       loggedInLinks.forEach(item => item.style.display = 'block');
//     } else {
//       // toggle user elements
//       adminItems.forEach(item => item.style.display = 'none');
//       loggedInLinks.forEach(item => item.style.display = 'none');
//     }
// };
const showFavorites = (user) => {
    console.log(user.uid)
    db.collection('user info').doc(user.uid).get().then(doc => {
        const favoritesArray = doc.data().favorites;
        favoritesArray.forEach(site =>{
            db.collection('sites').doc(site.id).get().then(doc =>{
                console.log(doc.data().name)
            })
        })
    })
}

auth.onAuthStateChanged(user => {
    if(user) {
        showFavorites(user)
    }
})

