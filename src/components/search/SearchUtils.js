import {myDatabase} from '../firebase/firebase'
import _ from 'underscore'


/**
 * This function recieves a string array "searchVal" and uses it to searche through the "sites" database for the sites that has similar search tokens.
 * It returns a array of site-like objects that contains the neccessary info for a search result.
 * The returned array is sorted by number of matches between "searchVal" and search tokens in each site.
 * @param {string[]} searchVals 
 */
export async function findSites(searchVals) {

    // Sets the accuracy to just above 50%. meaning the number of matches need to be atleast half of the words in "searchVal".
    let accuracy = Math.ceil(searchVals.length / 2.0)

    // Array of sites and their counter by number of matches.
    let sites = []

    // The returned array at the end.
    var sortedSites = []

    // Gets the snapshot of all the sites in the database.
    const snapshot = await myDatabase.collection('sites').get()

    // The following occurs for each site.
    snapshot.forEach(doc => {
        // A counter for the number of matches.
        var counter = 0

        // Pulls the site's search tokens
        var searchTokens = doc.data().searchTokens;

        // Counts the number of matches.
        searchVals.forEach(value => {
            if(searchTokens.includes(value)) {
                ++counter
            }
        })

        // Push site and counter to "sites" array if the counter is greater or equal to the accuracy variable.
        if (counter >= accuracy) {
            sites.push({counter: counter, document: doc})
        }

    })

    // Sorts the "sites" array in a decending order by the counter.
    sites = _.sortBy(sites, 'counter').reverse()

    // Takes the sites from the "sites" array and push it to the "sortedSites" array.
    sites.forEach(site => {
        // addToList(sortedSites, site.document)
        sortedSites.push({
            name: site.document.data().name,
            city: site.document.data().city,
            country: site.document.data().country,
            tags: site.document.data().tags,
            id: site.document.id
        })
    })

    return sortedSites;
}


/**
 * This function recieves a string "country" and uses it to searche through the "sites" database for the sites that are in the same country as the string "country"
 * It returns a array of site-like objects that contains the neccessary info for a marker.
 * @param {string} country 
 */
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


/**
 * This function recieves a string "name" and uses it to searche through the "roads" database for the roads that has the same name as the string "name"
 * It returns a array of roads.
 * @param {string} name 
 */
export async function getRoadByName(name){

    const NameField = "roadName";

    // The returned array at the end.
    let roadList = [];

    // Gets the snapshot of all the roads in the database that as the same name as the "name" variable.
    const snapshot = await myDatabase.collection('roads').where(NameField, '==', name).get()

    // Pushes the roads found to the "roadList" array.
    snapshot.docs.forEach(doc => {
        roadList.push(doc.data())
    })

    // console.log(roadList)
    return roadList;
}


/**
 * This function recieves a string "id" and uses it to searche through the "roads" database for the road that has the same id as the string "id"
 * It returns a road.
 * @param {string} id 
 */
export async function getRoadByID(id){
    return (await myDatabase.collection('roads').doc(id).get()).data()
}