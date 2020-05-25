import { myDatabase } from './firebase'

/* used to create new site from admin menu and added it to firestore */
export async function createNewSite(site){
    await myDatabase.collection('sites').add({
      name: site.name,
      city: site.city,
      country: site.country,
      tags: site.tags,
      address: site.address,
      externalSourceUrl: site.externalSourceUrl,
      imageUrl: site.imageUrl,
      fullInfo: site.fullInfo,
      partialInfo: site.partialInfo,
      latitude: site.latitude,
      longitude: site.longitude,
      searchTokens: site.searchTokens,
      vote: site.vote,
    })
}

/* used to update site from admin menu and updated it to firestore */
export async function UpdateSite(site){
    await myDatabase.collection('sites').doc(site.id).update({
      name: site.name,
      city: site.city,
      country: site.country,
      tags: site.tags,
      address: site.address,
      externalSourceUrl: site.externalSourceUrl,
      imageUrl: site.imageUrl,
      fullInfo: site.fullInfo,
      partialInfo: site.partialInfo,
      latitude: site.latitude,
      longitude: site.longitude,
      vote: site.vote,
      searchTokens: site.searchTokens
    })
}

/* used to delete site from admin menu and delete it to firestore */
export async function DeleteSiteFromDB(site){
    await myDatabase.collection('sites').doc(site.id).delete();
}

/* extract information about user, guest / admin / if it regestered. */
export async function getUserClaims(user){
    if(!user){
        return "guest"
    }
    let userClaims = "registered"
    var tokenResult = await user.getIdTokenResult()
    user.admin = tokenResult.claims.admin;
    if (user.admin) {
        userClaims = "admin"
    } else {
        console.log("is registered")
        userClaims = "registered"
    }
    return userClaims;
}

/* extract favorites that in user throughout userid */
export async function getFavoritesIDs(userid) {
    const user = await myDatabase.collection('accounts').doc(userid).get()
    return user.data().favorites
}

/* extract trail that in favorites for user throughout userid */
export async function getTrailFavoritesIDs(userid) {
    const user = await myDatabase.collection('accounts').doc(userid).get()
    return user.data().RoadsFavorites
}
// extract all information of site / trail from firestore.
export async function extarctData(kind,arrayList,id){
    var resultOfSite = []
    for (const site of arrayList){
        const siteFromFireStore = await myDatabase.collection(kind).doc(site).get();
        var getData = siteFromFireStore.data();
        if (!getData) {
            deleteDocumentFromDB(kind, site)
        } else {
            resultOfSite.push({
                tags: getData.tags,
                name: getData.name,
                imageUrl: getData.imageUrl,
                city: getData.city,
                country: getData.country,
                vote: getData.vote,
                latitude: getData.latitude ? getData.latitude : undefined,
                longitude: getData.longitude ? getData.longitude : undefined,
                id: id,
                uid: site,
                type: kind
            })
            id +=1;
        }
    }
    return resultOfSite
}
// extract all the favorites of user (by uid) from firestore.
export async function getFavorites(siteIdArray,trailsIdArray){
    var collectionName = ['sites','roads']
    var resultOfSite = []
    for(var i = 0; i < collectionName.length; ++i) {
        if(collectionName[i] == 'sites')
            resultOfSite = resultOfSite.concat(await extarctData(collectionName[i],siteIdArray,resultOfSite.length))
        else{
            resultOfSite = resultOfSite.concat(await extarctData(collectionName[i],trailsIdArray,resultOfSite.length))
        }
    }
    return resultOfSite;
}

// update favorites sites of user in firestore
export async function updateUserFavoriteSites(userid, newFavorites) {
    await myDatabase.collection('accounts').doc(userid).update({
        'favorites': newFavorites
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
}

/* get site from firestore according uid of specific uid.*/
export async function getSiteByID(siteid) {
    return  (await myDatabase.collection('sites').doc(siteid).get()).data()
}

/* used to create new trail from admin menu and added it to firestore */
export async function createNewTrail( {siteListID,trailName, trailDescription, CityList, CountryList, TagList, searchTokens, imageUrl} ){
    await myDatabase.collection('roads').add({
        name: trailName,
        description: trailDescription,
        siteList: siteListID,
        city:CityList,
        country:CountryList,
        tags: TagList,
        searchTokens:searchTokens,
        imageUrl: imageUrl,
        vote: 50,
    })
}

/* used to update favorites of user trail throughout user id in firestore */
export async function updateUserFavoriteTrails(userid, newFavorites) {
    myDatabase.collection('accounts').doc(userid).update({
        'RoadsFavorites': newFavorites
    })
    .catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

/* used to delete avaliable site from admin menu and delete it to firestore */
export async function deleteTrailFromDB(trail){
    await myDatabase.collection('roads').doc(trail.id).delete();
}

/* used to create new site from admin menu and added it to firestore */
export async function updateTrail( {siteListID,trailName,trailDescription,CityList,CountryList,TagList,searchTokens, imageUrl, vote}, trailId){
    await myDatabase.collection('roads').doc(trailId).update({
        name: trailName,
        description: trailDescription,
        siteList: siteListID,
        city:CityList,
        country:CountryList,
        tags: TagList,
        searchTokens:searchTokens,
        imageUrl: imageUrl,
        vote: vote,
    })
}
/* used to delete collection from firestore likes users */
async function deleteDocumentFromDB(collectionName, documentID) {
    await myDatabase.collection(collectionName).doc(documentID).delete();
}
/* used to create new site from admin menu and added it to firestore */
export async function createContactMassege(name, email, title, details){
    await myDatabase.collection('massege').add({
        name: name,
        email: email,
        title: title,
        details: details
    })
}
/* get all messages that availiable in firestore under message collection*/
export async function getMasseges(){
    var massegeList = []
    const snapshot = await myDatabase.collection('massege').get()
    snapshot.docs.forEach(doc => {
        var data = doc.data()
        massegeList.push({ id: doc.id,
                        name: data.name,
                        email: data.email,
                        title: data.title,
                        details: data.details,
                        })
    })
    return massegeList
}
/* used to delete messages from admin menu and firestore */
export async function deleteMassegeFromDB(massege){
    await myDatabase.collection('massege').doc(massege.id).delete();
}