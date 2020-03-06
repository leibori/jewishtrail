// Get the user's id.
const user_id = sessionStorage.getItem('user_id');

// Pulls the user's favorite sites based on his id from the database and show them.
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

// If the user's status has changed then check his status and show his favorites.
auth.onAuthStateChanged(user => {
    if(user) {
        showFavorites(user)
    }
})

