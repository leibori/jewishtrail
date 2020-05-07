import { myFirebase, myDatabase } from './firebase'
// isLikeSite

// like or dislike, swap 
export async function updateVote(userID, siteID, vote){
    const uniqueID = userID + siteID
    await myDatabase.collection('votes').doc(uniqueID).set({ 
        userID: userID,
        siteID: siteID,
        vote: vote,
        //timeStamp: myFirebase.database.ServerValue.TIMESTAMP
      })
}

export async function deleteVote(userID, siteID){
    const uniqueID = userID + siteID
    myDatabase.collection('votes').doc(uniqueID).delete();
}

export async function getVoteByUserID(userID){
    let voteList = []
    const snapshot = await myDatabase.collection('votes').where("userID", '==', userID).get()
    snapshot.docs.forEach(doc => {
        var data = doc.data()
        voteList.push({ 
            siteID: data.siteID,
            vote: data.vote
        })
    })
    return voteList
}
// http cloud function
// cron free sites 
// export async function calculateSitesScore(){
//     let map = {}
//     const snapshot = await myDatabase.collection('votes').get()
//     snapshot.docs.forEach(doc => {
//        var data = doc.data()
//        const {siteID, vote} = data
//        if(!(siteID in map)){
//         map[siteID] = {"positive": 0, "negative": 0}
//        }
//        const count  = map[siteID]
//        if(vote){
//         map[siteID] = {"positive": count.positive += 1, "negative": count.negative}
//        }
//        else{
//         map[siteID] = {"positive": count.positive, "negative": count.negative += 1}         
//        }
//     })
//     for(var key  in map) {
//          const count = map[key]
//          const ratio = (count.positive / (count.positive + count.negative)) * 100
//          updateVotingSite
//     }

// }

// async function updateVotingSite(siteID,ratio){
//      myDatabase.collection('sites').doc(siteID).update({ 
//         vote: ratio,
//       })    
// }

