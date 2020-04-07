import {myDatabase} from '../firebase/firebase'
import _ from 'underscore'

export async function findSites(searchVals) {

    var siteList = [], accuracy = Math.ceil(searchVals.length / 2.0)
    console.log(accuracy)

    const snapshot = await myDatabase.collection('sites').get()
    let sites = []
    snapshot.forEach(doc => {
        var counter = 0

        var searchTokens = doc.data().searchTokens;
        searchVals.forEach(value => {
            if(searchTokens.includes(value)) {
                ++counter
            }
        })

        if (counter >= accuracy) {
            sites.push({priority: counter, document: doc})
        }

    })
    sites = _.sortBy(sites, 'priority').reverse()
    // console.log(sites)
    sites.forEach(site => {
        addToList(siteList, site.document)
    })
    return siteList;
}

function addToList(siteList, doc){
    
    siteList.push({
        name: doc.data().name,
        city: doc.data().city,
        country: doc.data().country,
        tags: doc.data().tags,
        id: doc.id
    })
}

export async function findSitesByCountryForMarker(country) {
    var siteList = []
    const snapshot = await myDatabase.collection('sites').where("country", '==', country).get()
    snapshot.docs.forEach(doc => {
        var data = doc.data()
        siteList.push({ id: doc.id,
                        name: data.name,
                        address: data.address,
                        partialInfo: data.partialInfo,
                        latitude: data.latitude,
                        longitude: data.longitude
                        })
    })
    return siteList
}

export async function getRoadByName(name){
    const NameField = "roadName";
    let roadList = [];
    const snapshot = await myDatabase.collection('roads').where(NameField, '==', name).get()
        snapshot.docs.forEach(doc => {
            roadList.push(doc.data())
        })
        console.log(roadList)
        return roadList;
}

export async function getRoadByID(id){
    return (await myDatabase.collection('roads').doc(id).get()).data()
}