import { myDatabase } from './firebase'


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
export async function getFavorites(siteIdArray,roadsIdArray){
    var collectionName = ['sites','roads']
    var resultOfSite = []
    // var siteList = await getFavoritesIDs(userid)
    // var roadList = await getRoadFavoritesIDs(userid)
    for(var i = 0; i < collectionName.length; ++i) {
        if(collectionName[i] == 'sites')
            resultOfSite = resultOfSite.concat(await extarctData(collectionName[i],siteIdArray,resultOfSite.length))
        else{
            resultOfSite = resultOfSite.concat(await extarctData(collectionName[i],roadsIdArray,resultOfSite.length))
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


export async function createNewRoad( {siteListID,roadName,roadDescription,CityList,CountryList,TagList,searchTokens, imageUrl} ){
    await myDatabase.collection('roads').add({
        name: roadName,
        description: roadDescription,
        siteList: siteListID,
        city:CityList,
        country:CountryList,
        tags: TagList,
        searchTokens:searchTokens,
        imageUrl: imageUrl,
        vote: 50,
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

export async function updateRoad( {siteListID,roadName,roadDescription,CityList,CountryList,TagList,searchTokens, imageUrl, vote}, roadId){
    await myDatabase.collection('roads').doc(roadId).update({
        name: roadName,
        description: roadDescription,
        siteList: siteListID,
        city:CityList,
        country:CountryList,
        tags: TagList,
        searchTokens:searchTokens,
        imageUrl: imageUrl,
        vote: vote,
    })
}

async function deleteDocumentFromDB(collectionName, documentID) {
    await myDatabase.collection(collectionName).doc(documentID).delete();
}