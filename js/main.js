/*
  in this script I am using a loop to grab last 5 objects of my data arrray because
  I when I use splice, it will chop BOTH data arrays!
  ( i use two arrays- one is for mapping to render, either chopped down to 5 or show all, and a second array to retain all objects to restore the first one when needed)
*/
import React from 'react'
import ReactFire from 'reactfire'
var firebase = require('firebase');
firebase.initializeApp(config);

export default React.createClass({
  //****************************************************************************************************
  getDefaultProps() {
    return {
            user: { authed: false }
           }
  },
  //****************************************************************************************************
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
                  ],
     entireMonthlyData: [
                    {
                    }
                  ]

    }
  },
  //********************************* Exisiting user sign in ***********************************************
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
// ************* still need an ELSE for this IF in case user insnt new but has no data
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
               var data = entireData
               comp.setState({data})
               comp.setState({entireData})
             }
  //********   need ELSE statement to assign empty object to entireData if user isnt new but has no data
          } else {
            var entireData = []
            var data = []
            comp.setState({data})
            comp.setState({entireData})
          }
       })
       var ref = firebase.database().ref("/users/" + currentUser + "/" + "monthly");
       var comp = this
       ref.on("value", function(allData) {
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
           comp.setState({entireMonthlyData})
        })
        var ref = firebase.database().ref("/users/" + currentUser + "/" + "monthlyincome");
        var comp = this
        ref.on("value", function(allData) {
            if (allData.val() != null){
              monthlyIncome = allData.val()
              comp.setState({monthlyIncome})
            } else {
              var monthlyIncome = "0"
              comp.setState({monthlyIncome})
            }
 // is this line redundant below?
            comp.setState({monthlyIncome})
         })
     }
    })
  },
  //**************************************** New user sign in *************************************
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
// FIXME Do I need to read in ANY data for a new user? Duh.
// ************************** still need some code for monthly data for new user below this transactions section (cont)
// ************************** if ever give user option to go to directly to Monthly page from login
        var ref = firebase.database().ref("/users/" + currentUser + "/" + "transactions");
        var comp = this
        ref.on("value", function(allData) {
           // is this needed for new user? allData will always be null for new user
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
            // above IF statement maybe not needed for new user
            } else {
              var entireData = []
              var data = []
              comp.setState({data})
              comp.setState({entireData})
            }
         })
        //  var ref = firebase.database().ref("/users/" + currentUser + "/" + "monthly");
        //  var comp = this
        //  ref.on("value", function(allData) {
        //   //   var entireMonthlyData = []
        //   var entireMonthlyData = []
        //   comp.setState({entireMonthlyData})
        //   })
     this.setState(this.state.data)
     this.setState(this.state.entireMonthlyData)
    })
   this.setState(this.state.data)
   this.setState(this.state.entireData)
  },
  //***************************************** User sign out **********************************************
  signUserOut() {
    firebase.auth().signOut()
    this.state.monthlyFlag = undefined
    location.reload()
  },
  //****************************************** Adding Daily Transactions **********************************
  onClickSubmit(e){
    if (this.refs.amountInput.value != ""){
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
  //***************************************** Show all Daily Transactions **********************************
  onClickShowAll(){
    this.refs.Show5.className="visibleButton"
    this.refs.ShowAll.className="hiddenButton"
    this.state.data = this.state.entireData
    this.setState(this.state.data)
  },
  //***************************************** Show Only 5 Daily Transactions *********************************
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
  //****************************************** Modifying a Daily Transaction Amount ****************************
  onClickTransAmount(e){
    var transSelected = e.target.getAttribute('value')
    var newAmount = prompt("Enter new amount or 000 to delete")
    // FIXME: numeric testing here for input
    if (newAmount != "000"){
      if (newAmount != null && newAmount != "") {this.state.data[transSelected].amount = newAmount}
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
    this.refs.ShowAll.className="visibleButton"
    this.refs.Show5.className="hiddenButton"
  },
  //*********************************** Modifying a Daily Transaction description **************************
  onClickTransDescription(e){
    var transSelected = e.target.getAttribute('value')
    var newDesc = prompt("Enter new description")
    if (newDesc != null && newDesc != "") {this.state.data[transSelected].text = newDesc}
    var updates = {}
    var tempUser = firebase.auth().currentUser.email.split("@")
    var currentUser = tempUser[0]
    updates["/users/" + currentUser + "/" + "transactions"] = this.state.entireData
    firebase.database().ref().update(updates)
    this.setState(this.state.data)
    this.refs.ShowAll.className="visibleButton"
    this.refs.Show5.className="hiddenButton"
  },
  //**************************** Modifying the planned expense amount of a Monthly Bill *************************
  onClickMonthlyBillPlan(e){
    var transSelected = e.target.getAttribute('value')
    var newAmount = prompt("Enter new amount or 000 to delete")
    // FIXME: numeric testing here for input
    if (newAmount != "000"){
      if (newAmount != null && newAmount != "") {this.state.entireMonthlyData[transSelected].plan = newAmount}
    } else {
      this.state.entireMonthlyData.splice(transSelected,1)
      var dataLength = this.state.entireMonthlyData.length
      if (dataLength>5){
        var dataPos = dataLength - 5 + eval(transSelected)
        this.state.entireMonthlyData.splice(dataPos,1)
      } else {
        this.state.entireMonthlyData.splice(transSelected,1)
      }
    //  this.setState(this.state.data)
      this.setState(this.state.entireMonthlyData)
    }
    var updates = {}
    var tempUser = firebase.auth().currentUser.email.split("@")
    var currentUser = tempUser[0]
    updates["/users/" + currentUser + "/" + "monthly"] = this.state.entireMonthlyData
    firebase.database().ref().update(updates)
    this.setState(this.state.entireMonthlyData)
  },
  //***************************** Modifying the actual expense amount of a Monthly Bill ***********************
  onClickMonthlyBillActual(e){
    var transSelected = e.target.getAttribute('value')
    var newAmount = prompt("Enter new amount or 000 to delete")
    // FIXME: numeric testing here for input
    if (newAmount != "000"){
      if (newDesc != null && newDesc != "") {this.state.entireMonthlyData[transSelected].amount = newAmount}
    } else {
      this.state.entireMonthlyData.splice(transSelected,1)
      // is this needed for Monthly Bills, or just extra from Daily Trans copy?
      var dataLength = this.state.entireMonthlyData.length
      if (dataLength>5){
        var dataPos = dataLength - 5 + eval(transSelected)
        this.state.entireMonthlyData.splice(dataPos,1)
      } else {
        this.state.entireMonthlyData.splice(transSelected,1)
      }
      this.setState(this.state.entireMonthlyData)
    }
    // ********* above to comment maybe not needed
    var updates = {}
    var tempUser = firebase.auth().currentUser.email.split("@")
    var currentUser = tempUser[0]
    updates["/users/" + currentUser + "/" + "monthly"] = this.state.entireMonthlyData
    firebase.database().ref().update(updates)
    this.setState(this.state.entireMonthlyData)
  },
  //************************************ Modifying a Monthly Bill description *************************
  onClickMonthlyDescription(e){
    var transSelected = e.target.getAttribute('value')
    if (transSelected != "0" && newDesc != ""){
        var newDesc = prompt("Enter new description")
        // may not need this in condition since blocked above:  && transSelected != 0
        if (newDesc != null && transSelected != 0) {this.state.entireMonthlyData[transSelected].text = newDesc}
          var updates = {}
          var tempUser = firebase.auth().currentUser.email.split("@")
          var currentUser = tempUser[0]
          updates["/users/" + currentUser + "/" + "monthly"] = this.state.entireMonthlyData
          firebase.database().ref().update(updates)
          this.setState(this.state.entireMonthlyData)
     }
  },
  //************************************** Entering the Monthly Income Amount **************************
  onMonthlyIncomeInput(){
    var monthlyIncome = "$" + prompt("Enter Monthly Income")
    var tempUser = firebase.auth().currentUser.email.split("@")
    var currentUser = tempUser[0]
    var updates= {}
    updates["/users/" + currentUser + "/" + "monthlyincome"] = monthlyIncome
    firebase.database().ref().update(updates)
    this.setState({monthlyIncome})
  },
  //*************************************** Navigation button to Monthly Budget page ********************
  onClickMonthlyBudgetButton(){
    var monthlyFlag = true
    this.setState({monthlyFlag})
    this.refs.amountInput.value = ""
    this.refs.descriptionInput.value  = ""
  },
  //*************************************** Navigation button to Monthly Budget page ********************
  onClickDailyTransButton(){
    var monthlyFlag = undefined
    this.setState({monthlyFlag})
    this.refs.enterMonthlyAmount.value = ""
    this.refs.enterMonthlyBill.value  = ""
  },
  //************************************ Adding Monthly Budget items and amounts *************************
  onClickAddMonthlyBill(e){
    e.preventDefault()
    if (this.refs.enterMonthlyAmount.value != "" || this.refs.enterMonthlyBill.value != ""){
    var currentDate = Date().substring(4,15)
    var monthlyPlanInputValue = this.refs.enterMonthlyPlan.value
    var monthlyBillInputValue = this.refs.enterMonthlyBill.value
    // FIXME what can use instead of eval? need numeric testing here
    var monthlyAmountInputValue = this.refs.enterMonthlyAmount.value
    this.refs.enterMonthlyBill.value = ""
    this.refs.enterMonthlyAmount.value = ""
    this.refs.enterMonthlyPlan.value = ""
    var userId = this.state.user
    var updates = {};
    var tempUser = firebase.auth().currentUser.email.split("@")
    var currentUser = tempUser[0]
    var newData = ""
      newData=
          {
            amount: monthlyAmountInputValue,
              plan: monthlyPlanInputValue,
              date: currentDate,
              text: monthlyBillInputValue,
          }
        this.state.entireMonthlyData = this.state.entireMonthlyData.concat(newData)
      var monthlyData = this.state.entireMonthlyData
      var tempUser = firebase.auth().currentUser.email.split("@")
      var currentUser = tempUser[0]
      updates["/users/" + currentUser + "/" + "monthly"] = this.state.entireMonthlyData
      firebase.database().ref().update(updates)
      this.setState(this.state.entireMonthlyData)
    }
  },
  //*********************************** Help Button Popup **********************************************
  onClickHelpButton()
  {
    alert("This will be info button how to use app. When we are unhurried and wise, we perceive that only great and worthy things have any permanent and absolute existence, that petty fears and petty pleasures are but the shadow of the reality. -Henry David Thoreau")
  },
  //*********************************** Rendering the HTML elements *************************************
  render()
  {
    // console.log("monthly=",this.state.monthlyFlag);
    // console.log("auth=",firebase.auth().currentUser);
    // console.log("entireMonthlyData at render=",this.state.entireMonthlyData);
    // have to set this.state.monthlyFlag when loggin out
    if (firebase.auth().currentUser != null && this.state.monthlyFlag === undefined){
      return (
        <main>
      <section className="dailyTransPageSection">
        <article className="transactionTitleArea">
          <h1 className="transactionsTitle">DollarTrak - Daily Transactions</h1>
          <h2 className="userTransName"
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
        <input  className="amountItem"
                placeholder=" $ amount"
                ref="amountInput"
                type="number"/>
        <input  className="descriptionItem"
                placeholder="  description of purchase"
                ref="descriptionInput"
                type="text"/>
        <button className="createTrans"
                type="submit"
                onClick={this.onClickSubmit}>Submit</button>
        <button className="hiddenButton"
                ref="Show5" onClick={this.onClickShow5}>Show Last 5 Transactions Only</button>
        <button className="visibleButton"
                ref="ShowAll"
                onClick={this.onClickShowAll}>    Show All Transactions    </button>
              <button className="monthlyBudgetButton" onClick={this.onClickMonthlyBudgetButton}>Go to Monthly Budget</button>
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
                   placeholder="             email address"
                   ref="userInput"></input>
            <input className="passwordInput"
                   placeholder="               password"
                   ref="passwordInput"
                   type="password"></input>
            <button className="newUser" onClick={this.newUserSignUp}>NEW USER</button>
            <button className="submitUser" onClick={this.signUserIn}>LOGIN</button>
            <div className="helpContainer">
              <button className="helpButton" onClick={this.onClickHelpButton}>HELP</button>
            </div>
        </article>
        </section>
      </main>
     )
   }
   if (firebase.auth().currentUser != null && this.state.monthlyFlag === true)
    return (
      <main className="monthlyPageSection">
        <section className="monthlyBox">
          <article className="monthlyTitleArea">
            <h1 className="monthlyTitle">Monthly Budget</h1>
            <h2 className="userMonthlyName"
                ref="userName">User:  {firebase.auth().currentUser.email}</h2>
          </article>
          <div className="monthlyIncomeArea">
            <p className="monthlyIncomeLabel">Monthly Income</p>
            <a className="monthlyIncomeLink" href="#">
              <p className="monthlyIncomeInput" ref="monthlyInput" onClick={this.onMonthlyIncomeInput}>{this.state.monthlyIncome}</p>
            </a>
          </div>
          <h3 className="monthlyColumnTitles">      Type                         Description                                      Planned    Actual</h3>
          <ul id="list" className="monthyBillsRecordsArea">
           {
               this.state.entireMonthlyData.map((record, i)=>{
                 if (record.date != undefined
                     && record.text != "")
                 {
                   return <article className="eachRecordContainer" key={i}>
                              <p className="categoryBill">{record.date}</p>
                              <a href="#">
                                <p className="monthlyBillDesc" value={i}
                                    onClick={this.onClickMonthlyDescription}>{record.text}</p>
                              </a>
                              <a href="#">
                                <p className="monthlyBillPlan" value={i}                            onClick={this.onClickMonthlyBillPlan}>${record.plan}</p>
                              </a>
                              <a href="#">
                                <p className="monthlyBillActual" value={i}                            onClick={this.onClickMonthlyBillActual}>${record.amount}</p>
                              </a>
                          </article>
               }
             })
           }
         </ul>
         <article className="monthlyInputsArea">
          <input  className="enterMonthlyBill"
                  placeholder="description"
                  ref="enterMonthlyBill"
                  type="text"/>
          <input className="enterMonthlyPlannedAmount"
                  placeholder="plan"
                  ref="enterMonthlyPlan"
                  type="number"/>
          <input  className="enterMonthlyAmount"
                  placeholder="amount"
                  ref="enterMonthlyAmount"
                  type="number"/>
        </article>
        <article className="monthlyOptionsArea">
            <button className="createMonthlyBill"
                  type="submit"
                  onClick={this.onClickAddMonthlyBill}>Add Item</button>
            <button className="dailyTransButton" onClick={this.onClickDailyTransButton}>Go to Daily Transactions</button>
            <button className="monthlySignOut" onClick={this.signUserOut}>Log Out</button>
        </article>
        </section>
      </main>
    )
  }
})

/*
<form className="monthlyIncomeForm" onSubmit={this.onMonthlyIncomeInput}>
  <input  className="monthlyIncomeInput" ref="monthlyInput">{this.state.monthlyIncome}</input>
</form>
*/
