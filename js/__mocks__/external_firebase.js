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
