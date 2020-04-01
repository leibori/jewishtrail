import {myDatabase} from '../firebase/firebase'

export async function findSites(dropList, searchVal) {

    var siteList = []

    if (dropList === "tags") {
        var tag_list = [searchVal]

        const snapshot = await myDatabase.collection('sites').get()
        let sites = []
        snapshot.forEach(doc => {
            var docTags = doc.data().tags;
            const isSubSet = tag_list.every(val => docTags.includes(val));
            if(isSubSet){
                sites.push(doc)
            }
        });
        sites.forEach(doc => {
            addToList(siteList, doc)
        })
        return siteList;
    } else {
        const snapshot = await myDatabase.collection('sites').where(dropList, '==', searchVal).get()
        snapshot.docs.forEach(doc => {
            addToList(siteList, doc);
        })
        console.log(siteList)
        return siteList;
        
    }
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