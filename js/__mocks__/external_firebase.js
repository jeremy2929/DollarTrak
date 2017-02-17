const provider = {}

var fakeUser = null;

export function fbLogin(uid, cb) {
  fakeUser = {
      authed: true,
      name: "farfignuken",
      email: "email@email.com",
      lastLogin: "today",
      uid: "test",
      displayName: "name"
  }
}

export function fbSignOut() {
  return
}

export function fbAuthStateChanged(cb) {
  return cb(fakeUser)
}

export function updateFB(user) {
  //FIXME: Do we need to mock out database?
}

export function fbRef(dataPath) {
  return dataPath
}

export function fbGetUserValue(authUser, comp) {
  comp.setState({
    user: {
      authed: true,
      name: "test",
      email: "test@example.com",
      lastLogin: ""
    }
  })
}

export function fbCreateUserEmailAndPswd(uid, cb) {
  cb()
}

export function fbAuthCurrentUser() {
  return fakeUser
}

export function fbGetTransactionData(comp, currentUser) {
  //FIXME: probably need to set state with fake transaction data
}

export function fbGetMonthlyData(comp, currentUser) {
  //FIXME: probably need to set state with fake monthly data
}

export function fbGetMonthlyIncome(comp, currentUser) {
  //FIXME: probably need to set state with fake monthly data
}


//
//
//
//
// export function fbLogin(email,password){
//   return firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     if (errorCode === 'auth/wrong-password') {
//       alert('Wrong password.');
//     } else {
//       alert(errorMessage);
//     }
//   });
// }
//
// export function fbAuthCurrentUser(){
//   return firebase.auth().currentUser
// }
//
// export function fbCreateUserEmailAndPswd(email, password){
//   return firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     if (errorCode != null){comp.setState({errorCode})}
//     var errorMessage = error.message;
//     // [START_EXCLUDE]
//     if (errorCode == 'auth/weak-password') {
//       alert('The password is too weak.');
//     } else {
//       alert(errorMessage);
//     }
//     console.log(error);
//     // [END_EXCLUDE]
//   });
// }
//
// export function fbSignOut(){
//   return firebase.auth().signOut()
// }
//
// export function updateFB(updates){
//   return firebase.database().ref().update(updates)
// }
//
// export function fbRef(dataPath){
//   return firebase.database().ref(dataPath)
// }
//
// export function fbAuthStateChanged(authUser){
//   return firebase.auth().onAuthStateChanged(authUser)
// }
