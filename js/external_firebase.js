export function fbLogin(email,password){
  return firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode === 'auth/wrong-password') {
      alert('Wrong password.');
    } else {
      alert(errorMessage);
    }
  });
}

export function fbAuthCurrentUser(){
  return firebase.auth().currentUser
}

export function fbCreateUserEmailAndPswd(email, password){
  return firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    if (errorCode != null){comp.setState({errorCode})}
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
}

export function fbSignOut(){
  return firebase.auth().signOut()
}

export function updateFB(updates){
  return firebase.database().ref().update(updates)
}

export function fbRef(dataPath){
  return firebase.database().ref(dataPath)
}

export function fbGetUserValue(authUser, comp) {
  firebase.database().ref("/users/" + authUser.uid).once("value").then((snapshot) => {
    var snapshotReturn = snapshot.val()
    comp.setState({
      user: {
        authed: true,
        name: authUser.email,
        email: snapshotReturn.email,
        lastLogin: snapshotReturn.lastLogin
      }
    })
  })

}

// export function fbOnTransactionValue(dataPath, cb) {
//
// }

export function fbAuthStateChanged(authUser){
  return firebase.auth().onAuthStateChanged(authUser)
}

export function fbGetTransactionData(comp, currentUser) {
  firebase.database().ref("/users/" + currentUser + "/" + "transactions").on("value",   function(allData) {
// ************* does this still need an ELSE for this IF in case user insnt new but has no data
 if (allData.val() != null) {
    var entireData = allData.val()
    var dataLength = entireData.length
    var data=[]
    var data = entireData
    comp.setState({data})
    comp.setState({entireData})
//********   need ELSE statement to assign empty object to entireData if user isnt new but has no data
  } else {
    var entireData = []
    var data = []
    comp.setState({data})
    comp.setState({entireData})
  }
})
}

export function fbGetMonthlyData(comp, currentUser) {
  firebase.database().ref("/users/" + currentUser + "/" + "monthly").on("value", function(allData) {
 //   var entireMonthlyData = []
    if (allData.val() != null){
      entireMonthlyData = allData.val()
      comp.setState({entireMonthlyData})
    } else {
      var entireMonthlyData = []
      comp.setState({entireMonthlyData})
    }
// are these 2 lines redundant below?
 //   var entireMonthlyData = []
  //  comp.setState({entireMonthlyData})
 })

}

export function fbGetMonthlyIncome(comp, currentUser) {
    firebase.database().ref("/users/" + currentUser + "/" + "monthlyincome").on("value", function(allData) {
        if (allData.val() != null){
          monthlyIncome = allData.val()
          comp.setState({monthlyIncome})
        } else {
          var monthlyIncome = 0
          comp.setState({monthlyIncome})
        }
// is this line redundant below?
        comp.setState({monthlyIncome})
     })
}
