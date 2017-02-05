/*
  in this script I am using a loop to grab last 5 objects of my data arrray because
  I think when I use splice, it will chop BOTH data arrays!
  ( i use two arrays- one is for mapping to render, either chopped down to 5 or show all, and a second array to retain all objects to restore the first one when needed)

  example
   data  - my small array of only 5 objects
   entireData - my large array of all objects

   if entireData array contains 20 objects and I do this:
   var data = []
   data = entireData
   data.splice(entireData.length-5,5)  (or whatever is syntax is to get last 5 objects of entireData)

   it chops my data array down to the last 5 objects, but ALSO seems to CHOP MY entireData array DOWN TO 5, TOO!

*/

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
            data: [
                    {
                    }
                  ]
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
    });
    var currentUser = firebase.auth().currentUser
    var authUser = firebase.auth().currentUser
    firebase.auth().onAuthStateChanged((authUser) => {
      if (firebase.auth().currentUser != null){
        var currentUser = {};
        var today = new Date();
        var tempUser = firebase.auth().currentUser.email.split("@")
        var userId = tempUser[0]
        currentUser["/users/" + authUser.uid] = {
          name: authUser.displayName,
          email: authUser.email,
          lastLogin: Date()
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
      }
      if (firebase.auth().currentUser != null){
      var tempUser = firebase.auth().currentUser.email.split("@")
      var currentUser = tempUser[0]
      var userId = tempUser[0]
      var ref = firebase.database().ref("/users/" + currentUser + "/" + "transactions");
      var comp = this
      ref.on("value", function(allData) {
         if (allData.val() != null) {
             var entireData = allData.val()
             var dataLength = entireData.length
             var data=[]
             if (dataLength>5){
               var dataStart = dataLength-5
               var j = 0
               for (var i = dataStart; i<dataLength; i++){
                 data[j]=entireData[i]
                 j++
               }
               comp.setState({data})
               comp.setState({entireData})
             } else {
               data = entireData
               comp.setState({data})
               comp.setState({entireData})
             }
          }
       })
     }
    })
  },
  newUserSignUp(){
      var email = this.refs.userInput.value
      var password = this.refs.passwordInput.value
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START createwithemail]
      var comp = this
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
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
      if (this.state.errorCode === undefined)
      {
        alert("Account created! Click OK to login...")
      }
      var currentUser = firebase.auth().currentUser
      var authUser = firebase.auth().currentUser
      firebase.auth().onAuthStateChanged((authUser) => {
        var currentUser = {};
        var today = new Date();
        var tempUser = firebase.auth().currentUser.email.split("@")
        var userId = tempUser[0]
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
        var tempUser = firebase.auth().currentUser.email.split("@")
        var currentUser = tempUser[0]
        var userId = tempUser[0]
        var ref = firebase.database().ref("/users/" + currentUser + "/" + "transactions");
        var comp = this
        ref.on("value", function(allData) {
           if (allData.val() != null) {
               var entireData = allData.val()

               if (entireData.length > 5){

               var dataLength = entireData.length
               var dataStart = dataLength-5
               var data=[]
               var j = 0
               for (var i = dataStart; i<dataLength; i++){
                 data[j]=entireData[i]
                 j++
               }
               }
               comp.setState({data})
               comp.setState({entireData})
            } else {
              var entireData = []
              var data = []
              comp.setState({data})
              comp.setState({entireData})
            }
         })
         this.setState(this.state.data)
         this.setState(this.state.entireData)
      })
      this.setState(this.state.data)
      this.setState(this.state.entireData)
  },
  signUserOut() {
    firebase.auth().signOut()
    location.reload()
  },
  onClickSubmit(e){
    console.log(this.refs.amountInput.value);
    if (this.refs.amountInput.value != ""){
    /// FIXME need to block empty amounts from being submitted.......
    var currentDate = Date().substring(4,15)
    e.preventDefault()
    var textInputValue = this.refs.descriptionInput.value
    // FIXME what can use instead of eval? need numeric testing here
    var amountInputValue = this.refs.amountInput.value
    this.refs.descriptionInput.value = ""
    this.refs.amountInput.value = ""
    var userId = this.state.user
    var passwordId = this.state.pswd
    var updates = {};
    var tempUser = firebase.auth().currentUser.email.split("@")
    var currentUser = tempUser[0]
    var newData = ""
    var database = ""
//    if (textInputValue != ""){
      newData=
          {
            amount: amountInputValue,
              date: currentDate,
              text: textInputValue,
          }
        this.state.entireData = this.state.entireData.concat(newData)
      // rebuilding data last 5 since a new one was added
      if (this.state.entireData.length >5){
        var dataLength = this.state.entireData.length
        var dataStart = dataLength-5
        var data=[]
        var j = 0
        for (var i = dataStart; i<dataLength; i++){
          data[j]=this.state.entireData[i]
          j++
        }
      } else {
        data = this.state.entireData
      }
      var tempUser = firebase.auth().currentUser.email.split("@")
      var currentUser = tempUser[0]
      updates["/users/" + currentUser + "/" + "transactions"] = this.state.entireData
      this.refs.ShowAll.className="visibleButton"
      this.refs.Show5.className="hiddenButton"
      firebase.database().ref().update(updates)
    }
    this.setState({data})
  },
  onClickShowAll(){
    this.refs.Show5.className="visibleButton"
    this.refs.ShowAll.className="hiddenButton"
    this.state.data = this.state.entireData
    this.setState(this.state.data)
  },
  onClickShow5(){
    this.refs.ShowAll.className="visibleButton"
    this.refs.Show5.className="hiddenButton"
    var dataLength = this.state.entireData.length
    if(dataLength > 5){
      var dataStart = dataLength-5
      var data=[]
      var j = 0
      for (var i = dataStart; i<dataLength; i++){
        data[j]=this.state.entireData[i]
        j++
      }
    } else {
      data = this.state.entireData
    }
    this.setState({data})
  },
  onClickTransAmount(e){
    var transSelected = e.target.getAttribute('value')
    var newAmount = prompt("Enter new amount or 000 to delete")
    // FIXME: numeric testing here for input
    if (newAmount != "000"){
      this.state.data[transSelected].amount = newAmount
    } else {
      this.state.data.splice(transSelected,1)
      var dataLength = this.state.entireData.length
      if (dataLength>5){
        var dataPos = dataLength - 5 + eval(transSelected)
        this.state.entireData.splice(dataPos,1)
      } else {
        this.state.entireData.splice(transSelected,1)
      }
      this.setState(this.state.data)
      this.setState(this.state.entireData)
    }
    var updates = {}
    var tempUser = firebase.auth().currentUser.email.split("@")
    var currentUser = tempUser[0]
    updates["/users/" + currentUser + "/" + "transactions"] = this.state.entireData
    firebase.database().ref().update(updates)
    this.setState(this.state.data)
  },
  onClickTransDescription(e){
    var transSelected = e.target.getAttribute('value')
    var newDesc = prompt("Enter new description")
    this.state.data[transSelected].text = newDesc
    var updates = {}
    var tempUser = firebase.auth().currentUser.email.split("@")
    var currentUser = tempUser[0]
    updates["/users/" + currentUser + "/" + "transactions"] = this.state.entireData
    firebase.database().ref().update(updates)
    this.setState(this.state.data)
  },
  render()
  {
    if (firebase.auth().currentUser != null){
      return (
        <main>
      <section className="pageSection">
        <article className="transactionTitleArea">
          <h1 className="transactionsTitle">DollarTrak - Daily Transactions</h1>
          <h2 className="userName"
              ref="userName">User:  {firebase.auth().currentUser.email}</h2>
        </article>
        <ul id="list" className="newList">
         {
             this.state.data.map((record, i)=>{
               if (record.date != undefined
                   && record.text != "")
               {
                 return <article className="eachRecordContainer" key={i}>
                          <p className="transDate">{record.date}</p>
                          <a href="#">
                            <p className="transAmount" value={i}                            onClick={this.onClickTransAmount}>${record.amount}</p>
                          </a>
                          <a href="#">
                            <p className="transDesc" value={i}
                              onClick={this.onClickTransDescription}>{record.text}</p>
                          </a>
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
                   placeholder="  email address"
                   ref="userInput"></input>
            <input className="passwordInput"
                   placeholder="  password"
                   ref="passwordInput"
                   type="password"></input>
            <button className="newUser" onClick={this.newUserSignUp}>NEW USER</button>
            <button className="submitUser" onClick={this.signUserIn}>LOGIN</button>
          </article>
        </section>
      </main>
     )
   }
  }
})
