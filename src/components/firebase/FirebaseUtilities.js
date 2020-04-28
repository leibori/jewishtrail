import { myDatabase } from './firebase'


export async function createNewSite(site){
    await myDatabase.collection('sites').add({
      name: site.name,
      city: site.city,
      country: site.country,
      tags: site.tags,
      adress: site.adress,
      externalSourceUrl: site.externalSourceUrl,
      imageUrl: site.imageUrl,
      fullInfo: site.fullInfo,
      partialInfo: site.partialInfo,
      latitude: site.latitude,
      longitude: site.longitude,
      searchTokens: site.searchTokens,
    })
}


export async function UpdateSite(site){
    await myDatabase.collection('sites').doc(site.id).update({
      name: site.name,
      city: site.city,
      country: site.country,
      tags: site.tags,
      adress: site.adress,
      externalSourceUrl: site.externalSourceUrl,
      imageUrl: site.imageUrl,
      fullInfo: site.fullInfo,
      partialInfo: site.partialInfo,
      latitude: site.latitude,
      longitude: site.longitude
    })
}


export async function DeleteSiteFromDB(site){
    await myDatabase.collection('sites').doc(site.id).delete();
}


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


export async function getFavoritesIDs(userid) {
    const user = await myDatabase.collection('accounts').doc(userid).get()
    return user.data().favorites
}


export async function getRoadFavoritesIDs(userid) {
    const user = await myDatabase.collection('accounts').doc(userid).get()
    return user.data().RoadsFavorites
}

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
                id: id,
                uid: site,
                type: kind
            })
            id +=1;
        }
    }
    return resultOfSite
}
export async function getFavorites(userid){
    var collectionName = ['sites','roads']
    var resultOfSite = []
    var siteList = await getFavoritesIDs(userid)
    var roadList = await getRoadFavoritesIDs(userid)
    for(var i = 0; i < collectionName.length; ++i) {
        if(collectionName[i] == 'sites')
            resultOfSite = resultOfSite.concat(await extarctData(collectionName[i],siteList,resultOfSite.length))
        else{
            resultOfSite = resultOfSite.concat(await extarctData(collectionName[i],roadList,resultOfSite.length))
        }
    }
    return resultOfSite;
}


export async function updateUserFavoriteSites(userid, newFavorites) {
    await myDatabase.collection('accounts').doc(userid).update({
        'favorites': newFavorites
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
}


export async function getSiteByID(siteid) {
    return  (await myDatabase.collection('sites').doc(siteid).get()).data()
}


export async function createNewRoad( {siteListID,roadName,roadDescription,CityList,CountryList,TagList,searchTokens, imgUrl} ){
    await myDatabase.collection('roads').add({
        name: roadName,
        description: roadDescription,
        siteList: siteListID,
        city:CityList,
        country:CountryList,
        tags: TagList,
        searchTokens:searchTokens,
        imageUrl: imgUrl,
    })
}


export async function updateUserFavoriteRoads(userid, newFavorites) {
    myDatabase.collection('accounts').doc(userid).update({
        'RoadsFavorites': newFavorites
    })
    .catch(function(error) {
        console.error("Error removing document: ", error);
    });
}


export async function deleteRoadFromDB(road){
    await myDatabase.collection('roads').doc(road.id).delete();
}

export async function updateRoad( {siteListID,roadName,roadDescription,CityList,CountryList,TagList,searchTokens, imgUrl}, roadId){
    await myDatabase.collection('roads').doc(roadId).update({
        name: roadName,
        description: roadDescription,
        siteList: siteListID,
        city:CityList,
        country:CountryList,
        tags: TagList,
        searchTokens:searchTokens,
        imageUrl: imgUrl,
    })
}

async function deleteDocumentFromDB(collectionName, documentID) {
    await myDatabase.collection(collectionName).doc(documentID).delete();
}