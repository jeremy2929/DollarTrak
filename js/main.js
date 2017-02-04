import React from 'react'
import { ajax } from 'jquery'
import ReactFire from 'reactfire'
var firebase = require('firebase');
firebase.initializeApp(config);

export default React.createClass({
  getDefaultProps() {
    return {
      user: { authed: false }
    }
  },
  getInitialState() {
    return {
      provider: () => {},
      user: {
        authed: false,
        name: '',
        email: '',
        picture: '',
        lastLogin: undefined
      },
      data: {

      }
    }
  },
  signUserIn() {
    var email = this.refs.userInput.value
    var password = this.refs.passwordInput.value
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
    var currentUser = firebase.auth().currentUser
    var authUser = firebase.auth().currentUser
    firebase.auth().onAuthStateChanged((authUser) => {
        var currentUser = {};
        var today = new Date();
        currentUser["/users/" + authUser.uid] = {
          name: authUser.displayName,
          email: authUser.email,
          lastLogin: "today"
        }
        firebase.database().ref().update(currentUser)
        // This sets up a callback once firebase reports that /users/{user.uid} has a value
        firebase.database().ref("/users/" + authUser.uid).once("value").then((snapshot) => {
          var snapshotReturn = snapshot.val()
          this.setState({
            user: {
              authed: true,
              name: authUser.email,
              email: snapshotReturn.email,
              lastLogin: snapshotReturn.lastLogin
            }
          })
        });
  })
  var tempUser = firebase.auth().currentUser.email.split("@")
  var currentUser = tempUser[0]
  var userId = tempUser[0]
  var ref = firebase.database().ref(userId+"/"+"transactions");
  var comp = this
  var data = {}
  var database = {}
  ref.on("value", function(allData) {
     data = allData.val()
     data.reverse()
     var dataLength = data.length
     data.splice(5,dataLength-5)
     database = allData.val()
     comp.setState({data})
     comp.setState({database})
      }, function (error) {
  })
  this.setState(this.state.data)
},
signUserOut() {
  firebase.auth().signOut()
  location.reload()
 },
  componentDidMount(){
},
  onClickSubmit(e){
    var currentDate = Date().substring(4,16)
    e.preventDefault()
    var textInputValue = this.refs.descriptionInput.value
    var amountInputValue = this.refs.amountInput.value
    this.refs.descriptionInput.value = ""
    this.refs.amountInput.value = ""
    var userID = this.state.user
    var passwordID = this.state.pswd
    var updates = {};
    var tempUser = firebase.auth().currentUser.email.split("@")
    var currentUser = tempUser[0]
    var newData = ""
    var database = ""
    if (textInputValue != ""){
      newData=
          {
            amount: amountInputValue,
              date: currentDate,
              text: textInputValue,
          },
      this.state.data = this.state.data.concat(newData),
      this.setState(this.state.data)
      updates[currentUser + '/' + "transactions"] = this.state.data;
      return firebase.database().ref().update(updates);
    }
  },
  onClickShowAll(){
    this.refs.Show5.className="visibleButton"
    this.refs.ShowAll.className="hiddenButton"
    this.state.data = this.state.database
    this.setState(this.state.data)
  },
  onClickShow5(){
    this.refs.ShowAll.className="visibleButton"
    this.refs.Show5.className="hiddenButton"
    var dataLength = this.state.data.length-5
    this.state.data=[]
    for (var j = dataLength;j<dataLength+5; j++){
      this.state.data[j]=this.state.database[j]
    }
    this.setState(this.state.data)
  },
  render()

  {
    if (firebase.auth().currentUser != null){
      return (
        <main>
      <section className="pageSection">
        <h1 className="transactionsTitle">DollarTrak - Daily Transactions</h1>
        <h2 className="userName"
            ref="userName">User:  {firebase.auth().currentUser.email}</h2>
        <ul id="list" className="newList">
          {
            this.state.data.map((record, i)=>{
              if (record.date != undefined
               && record.text != "")
               {
                return <article className="eachRecordContainer" key={i}>
                          <p className="transDate">{record.date}</p>
                          <p className="transAmount">${record.amount}</p>
                          <p className="transDesc">{record.text}</p>
                          <p className="transID">{record.user}</p>
                      </article>
              }
            })
          }
        </ul>
        <input className="amountItem"
               placeholder=" $ amount"
               ref="amountInput"
               type="text"/>
        <input className="descriptionItem"
               placeholder="  description of purchase"
               ref="descriptionInput"
               type="text"/>
        <button className="createTrans"
                type="submit"
                onClick={this.onClickSubmit}>Submit</button>
        <button className="hiddenButton"
                ref="Show5"
                onClick={this.onClickShow5}>Show Last 5 Transactions Only</button>
        <button className="visibleButton"
                ref="ShowAll"
                onClick={this.onClickShowAll}>    Show All Transactions    </button>
        <button className="signOut"
                onClick={this.signUserOut}>Log Out</button>
      </section>
      </main>
    )
  } else if (firebase.auth().currentUser === null)
   {
    return (
      <main>
        <section className="loginPage">
          <article className="loginTitleSection">
            <img className="loginImage" src="styles/titleLogin.jpg"></img>
            <h1 className="titleLogin">DollarTrak</h1>
            <img className="loginImage" src="styles/titleLogin.jpg"></img>
          </article>
          <article className="loginButtonsSection">
            <h2 className="loginLabel">     </h2>
            <input className="userNameInput"
                   placeholder="jeemy2929@twc.com"
                   ref="userInput"></input>
            <input className="passwordInput"
                   placeholder="master"
                   ref="passwordInput"></input>
            <button className="submitUser" onClick={this.signUserIn}>LOGIN</button>
          </article>
        </section>
      </main>
     )
   }
  }
})
