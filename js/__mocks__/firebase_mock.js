const provider = {}

export function fbLogin(uid, cb) {
  console.log("FIXME: In mocked fbSignInWithRedirect")
}

export function fbSignOut(cb) {
  return cb()
}

export function fbAuthStateChanged(cb) {
  return cb()
}

export function updateFB(user) {
  //FIXME: Do we need to mock out database?
}

export function fbAuthStateChanged(cb) {
  cb()
}

export function fbRef(cb) {
  cb()
}

export function fbCreateUserEmailAndPswd(uid, cb) {
  cb()
}

export function fbAuthCurrentUser(cb) {
  console.log("testtt");
  cb()
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
