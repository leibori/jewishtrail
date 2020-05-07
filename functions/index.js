const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.addAdminRole = functions.https.onCall((data, context) => {
  // check request is made by an admin
  if ( context.auth.token.admin !== true ) {
    return { error: 'Only admins can add other admins' }
  }
  // get user and add admin custom claim
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {
      admin: true
    })
  }).then(() => {
    return {
      message: `Success! ${data.email} has been made an admin.`
    }
  }).catch(err => {
    return err;
  });
});

exports.GetSites = functions.https.onCall((data,context) => {
  const tags = data.tags
	db.collection('sites').get().then(snapsshot => {
		let sites = []
		snapsshot.forEach(doc => {
			docTags = doc.data().tags;
			const isSubSet = tags.every(val => docTags.includes(val));
			if(isSubSet){
				sites.push(doc)
      }
		});
		return {result:sites};
	}).catch(err => console.error(err));
})

exports.deleteUserByEmails = functions.https.onCall((data, context) => {
  // check request is made by an admin
  if ( context.auth.token.admin !== true ) {
    return { error: 'Only admins can delete other users' }
  }
  // find user id by email
  return admin.auth().getUserByEmail(data.email).then(user => {
    admin.firestore().collection('accounts').doc(user.uid).delete();
    console.log(user)
    admin.auth().deleteUser(user.uid).then(() => {
      console.log(data.email + "has been deleted")
      return {
        message: `${data.email} has been deleted`
      }       
    }).catch(err =>{
        return err
    })
  }).then(() => {
    return {
      message: `Success! ${data.email} has been delete.`
    }
  }).catch(err => {
    return err;
  });
});

exports.updateVotes = functions.https.onRequest(async (request,response)=>{
  try {let map = {}
    const snapshot = await db.collection('votes').get()
    snapshot.docs.forEach(doc => {
       var data = doc.data()
       const {siteID, vote} = data
       if(!(siteID in map)){
         map[siteID] = {"positive": 0, "negative": 0}
       }
       const count  = map[siteID]
       if(vote){
        map[siteID] = {"positive": count.positive += 1, "negative": count.negative}
       }
       else{
        map[siteID] = {"positive": count.positive, "negative": count.negative += 1}         
       }
    })
    for(var key  in map) {
         const count = map[key]
         const ratio = (count.positive / (count.positive + count.negative)) * 100
         console.log(ratio + " " + key)
         db.collection('sites').doc(key).update({ 
          vote: ratio,
        })    
    }
    response.status(200).json({message: 'success'});}
    catch(e) {
      response.status(500).json({message: 'fail'});
    }
})