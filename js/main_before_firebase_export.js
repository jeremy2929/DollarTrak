/*
  in this script I am using a loop to grab last 5 objects of my data arrray because
  I when I use splice, it will chop BOTH data arrays!
  ( I use two arrays- one is for mapping to render, either chopped down to 5 or show all, and a second array to retain all objects to restore the first one when needed)
*/
import React from 'react'
import ReactDOM from 'react-dom'
import ReactFire from 'reactfire'
var firebase = require('firebase');
firebase.initializeApp(config);

var monthlyPlannedTotalValue = 0
var monthlyActualTotalValue = 0
var mptClass = "monthlyPlannedTotal"
var matClass = "monthlyActualTotal"
var mptAlertClass = "monthlyPlannedTotalAlert_hidden"
var matAlertClass = "monthlyActualTotalAlert_hidden"
var monthlyBillSelectedIndex = -1
var selectedTrans = []
var greyBar
var greenBar = "0%"
var redBar = "0%"
// activate next line when deploying- commented out for easier testing. it ensures previous user sign out
// firebase.auth().signOut()
var elementTest = {}
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
            //  if (dataLength>5){
            //    var dataStart = dataLength-5
            //    var j = 0
            //    for (var i = dataStart; i<dataLength; i++){
            //      data[j]=entireData[i]
            //      j++
            //    }
            //    comp.setState({data})
            //    comp.setState({entireData})
            //  } else {
               var data = entireData
               comp.setState({data})
               comp.setState({entireData})
            // }
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
        // var ref = firebase.database().ref("/users/" + currentUser + "/" + "transactions");
        // var comp = this
        // ref.on("value", function(allData) {
        //    // is this needed for new user? allData will always be null for new user
        //    if (allData.val() != null) {
        //        var entireData = allData.val()
        //        if (entireData.length > 5){
        //            var dataLength = entireData.length
        //            var dataStart = dataLength-5
        //            var data=[]
        //            var j = 0
        //            for (var i = dataStart; i<dataLength; i++){
        //              data[j]=entireData[i]
        //              j++
        //            }
        //        }
        //        comp.setState({data})
        //        comp.setState({entireData})
        //     // above IF statement maybe not needed for new user
        //     } else {
        //       var entireData = []
        //       var data = []
        //       comp.setState({data})
        //       comp.setState({entireData})
        //     }
        //  })
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
    if (this.refs.amountInput.value != "" || parseInt(this.refs.amountInput.value > -.01)){
        var currentDate = Date().substring(4,15)
        e.preventDefault()
        var textInputValue = this.refs.descriptionInput.value
        var amountInputValue = this.refs.amountInput.value
        amountInputValue = this.numericValidate(amountInputValue)
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
          //  rebuilding data last 5 since a new one was added
          if (this.state.entireData.length >5 && this.state.monthlyFlag != true){
            var dataLength = this.state.entireData.length
            var dataStart = dataLength-5
            var data=[]
            var j = 0
            for (var i = dataStart; i<dataLength; i++){
              data[j]=this.state.entireData[i]
              j++
            }
            this.refs.ShowAll.className="showLast5Trans"
            this.refs.Show5.className="hiddenButton"
          } else {
            data = this.state.entireData
            this.refs.ShowAll.className="hiddenButton"
            this.refs.Show5.className="showLast5Trans"
          }
          // updating FireBase with new data
          var tempUser = firebase.auth().currentUser.email.split("@")
          var currentUser = tempUser[0]
          updates["/users/" + currentUser + "/" + "transactions"] = this.state.entireData
          firebase.database().ref().update(updates)
    } else {
      alert("Negatives values not allowed")
      this.refs.descriptionInput.value = ""
      this.refs.amountInput.value = ""
    }
    this.setState({data})
    this.setState(this.state.data)
  },
  //***************************************** Show all Daily Transactions **********************************
  onClickShowAll(){
    this.refs.Show5.className="showLast5Trans"
    this.refs.ShowAll.className="hiddenButton"
    this.state.data = this.state.entireData
    this.setState(this.state.data)
  },
  //***************************************** Show Only 5 Daily Transactions *********************************
  onClickShow5(){
    this.refs.ShowAll.className="showLast5Trans"
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
  //********************************** Modifying a Daily Transaction Amount ****************************
  onClickTransAmount(e){
    /// fix bug here if Prompt is canceled, doesnt write over current valus with null
    var transSelected = e.target.getAttribute('value')
    var newAmount = prompt("Enter new amount or 000 to delete")
    // validating amount entered for numeric only, under 5 digits, or 000 for delete record
        if (newAmount === "000"){
            this.state.data.splice(transSelected,1)
            var dataLength = this.state.entireData.length
            if (dataLength>5){
              var dataPos = dataLength - 5 + eval(transSelected)
              this.state.entireData.splice(dataPos,1)
            } else {
              this.state.entireData.splice(transSelected,1)
            }
        } else if (newAmount != null && newAmount > -.01){
          var numericAmount = this.numericValidate(newAmount)
          if (numericAmount === parseInt(newAmount,10)) {
            if (newAmount.length > 4){
              alert("Values longer than 4 digits not allowed")
            } else {
              this.state.data[transSelected].amount = numericAmount
              this.setState(this.state.data)
            }
          }
        }

    var updates = {}
    var tempUser = firebase.auth().currentUser.email.split("@")
    var currentUser = tempUser[0]
    updates["/users/" + currentUser + "/" + "transactions"] = this.state.entireData
    firebase.database().ref().update(updates)
    this.setState(this.state.data)
    this.refs.ShowAll.className="showLast5Trans"
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
    this.refs.ShowAll.className="showLast5Trans"
    this.refs.Show5.className="hiddenButton"
  },
  //******************* Modifying the planned expense amount of a Monthly Bill *************************
  onClickMonthlyBillPlan(e){
    var transSelected = e.target.getAttribute('value')
    var newAmount = prompt("Enter new amount or 000 to delete")
        // validating amount entered for numeric only, under 5 digits, or 000 for delete record
        if (newAmount === "000"){
            this.state.entireMonthlyData.splice(transSelected,1)
        } else if (newAmount != null && newAmount > -.01){
          var numericAmount = this.numericValidate(newAmount)
          if (numericAmount === parseInt(newAmount,10)) {
            if (newAmount.length > 4){
              alert("Values longer than 4 digits not allowed")
            } else {
              this.state.entireMonthlyData[transSelected].plan = numericAmount
              this.setState(this.state.entireMonthlyData)
            }
          }
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
        // validating amount entered for numeric only, under 5 digits, or 000 for delete record
        if (newAmount === "000"){
            this.state.entireMonthlyData.splice(transSelected,1)
        } else if (newAmount != null && newAmount > -.01){
          var numericAmount = this.numericValidate(newAmount)
          if (numericAmount === parseInt(newAmount,10)) {
            if (newAmount.length > 4){
              alert("Values longer than 4 digits not allowed")
            } else {
                this.state.entireMonthlyData[transSelected].amount = numericAmount
                this.setState(this.state.entireMonthlyData)
            }
          }
        }

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
    var monthlyIncome = prompt("Enter Monthly Income")
    // callling a function for converting any non-numeric input to 0
    monthlyIncome = this.numericValidate(monthlyIncome)
    var tempUser = firebase.auth().currentUser.email.split("@")
    var currentUser = tempUser[0]
    var updates= {}
    updates["/users/" + currentUser + "/" + "monthlyincome"] = monthlyIncome
    firebase.database().ref().update(updates)
    this.setState({monthlyIncome})
  },
  //*************************************** Validating numeric input, set to 0 if NaN ********************
  numericValidate(num){
    num = parseInt(num, 10)
    if (isNaN(num)){num = 0}
    return num
  },
  //*************************************** Navigation button to Monthly Budget page ********************
  onClickMonthlyBudgetButton(){

    var monthlyFlag = true
    this.setState({monthlyFlag})
    this.refs.amountInput.value = ""
    this.refs.descriptionInput.value  = ""
  },
  //*************************************** Navigation button to Daily Transactions page ********************
  onClickDailyTransButton(){
    var monthlyFlag = undefined
    this.setState({monthlyFlag})
    this.refs.enterMonthlyBill.value  = ""
    this.refs.ShowAll.className="showLast5Trans"
    this.refs.Show5.className="hiddenButton"
  },
  //****************************** Adding Monthly Budget items and planned amounts *************************
  onClickAddMonthlyBill(e){
    e.preventDefault()
    if (this.refs.enterMonthlyPlan.value != "" || this.refs.enterMonthlyBill.value != "" && parseInt(this.refs.amountInput.value > -.01)){
        var currentDate = Date().substring(4,15)
        var monthlyPlanInputValue = this.refs.enterMonthlyPlan.value
        monthlyPlanInputValue = this.numericValidate(monthlyPlanInputValue)
        var monthlyBillInputValue = this.refs.enterMonthlyBill.value
        var monthlyType = monthlyBillInputValue.substring(0,3)
        // FIXME what can use instead of eval? need numeric testing here
        this.refs.enterMonthlyBill.value = ""
        this.refs.enterMonthlyPlan.value = ""
        var userId = this.state.user
        var updates = {}
        var tempUser = firebase.auth().currentUser.email.split("@")
        var currentUser = tempUser[0]
        var newData = ""
          newData=
              {
                amount: "",
                  plan: monthlyPlanInputValue,
                  type: monthlyType,
                  text: monthlyBillInputValue,
              }
          this.state.entireMonthlyData = this.state.entireMonthlyData.concat(newData)
          var monthlyData = this.state.entireMonthlyData
          var tempUser = firebase.auth().currentUser.email.split("@")
          var currentUser = tempUser[0]
          updates["/users/" + currentUser + "/" + "monthly"] = this.state.entireMonthlyData
          firebase.database().ref().update(updates)
          this.setState(this.state.entireMonthlyData)
        } else {
          alert("Negatives values not allowed")
          this.refs.enterMonthlyBill.value = ""
          this.refs.enterMonthlyPlan.value = ""
        }
    //  this.setState({data})
      this.setState({entireData})
  },
  //********************** Show Daily Transactions Page on Monthly Page ********************************
  onShowDailyTransPage(){
    this.refs.Show5.className="showLast5Trans"
    this.refs.ShowAll.className="hiddenButton"
    this.refs.goToDaily.className="hiddenButton"
    this.state.data = this.state.entireData
    this.setState(this.state.data)
    this.refs.monthlyDailyTransBox.className = "monthlyDailyTransBox"
    this.refs.showDailyTransPage.className = "showDailyTransPage_hidden"
    this.refs.hideDailyTransPage.className = "hideDailyTransPage"
    this.refs.monthlyBox.className = "monthlyBoxLeft"
  },
  //********************** Hide Daily Transactions Page on Monthly Page ********************************
  onHideDailyTransPage(){
    this.refs.monthlyDailyTransBox.className = "monthlyDailyTransBox_hidden"
    this.refs.hideDailyTransPage.className = "hideDailyTransPage_hidden"
    this.refs.showDailyTransPage.className = "showDailyTransPage"
    this.refs.goToDaily.className="dailyTransButton"
    this.refs.monthlyBox.className = "monthlyBoxCenter"
  },
  //********************** Alert for Monthly Plan exceeding income ********************************
  monthlyTotalRed(){
    this.refs.monthlyPlannedTotal.className="monthlyPlannedTotal_red"
  },
  //********************** Removing alert for Monthly Plan exceeding income ********************************
  monthlyTotalGreen(){
    this.refs.monthlyPlannedTotal.className="monthlyPlannedTotal"
  },
  //********************** Highlighting selected category of Monthly for Import ***************************
  onClickMonthlyTypeSelected(e){
    if (monthlyBillSelectedIndex === -1){
      monthlyBillSelectedIndex = e.target.getAttribute('value')
      e.target.className = "monthlyTypeSelected"
    } else {
      e.target.className = "monthlyType"
    }
    this.setState({monthlyBillSelectedIndex})
  },
  //********************** Highlighting selected transaction on Daily Trans for Import ********************
  onClickSelectedTrans(e){
    if (e.target.className === "transDateSelected"){
      var transIndex = selectedTrans.indexOf(e.target.getAttribute('value'))
      e.target.className = "transDate"
      selectedTrans.splice(transIndex,1)
    } else {
      e.target.className = "transDateSelected"
      selectedTrans = selectedTrans.concat(e.target.getAttribute('value'))
    }
  },
  //****************** Importing selected Daily Transactions into selected Monthly Category *****************
  onClickImportButton(e){
    // be sure at least one of each Monthly and Daily Transactions are selected
    if (monthlyBillSelectedIndex != -1 && selectedTrans.length != 0){

// maybe make function for this highlight removal

        // reverting yellow highlight of selected Daily Transactions to import back to normal class
        var transSelect = document.getElementsByClassName("transDateSelected")
        var selectedLEN = transSelect.length
        for (var i = 0; i< selectedLEN; i++){
          transSelect.transBox.className = "transDate"
        }
        // reverting yellow highlight of selected Monthly category of import back to normal class
        var monthBillHighlight = document.getElementsByClassName("monthlyTypeSelected")
        var selectedLEN = monthBillHighlight.length
        for (var i = 0; i< selectedLEN; i++){
          monthBillHighlight.monthBox.className = "monthlyType"
        }



        // converting array of strings of selected Daily Transactions to numeric format
        var selectedLength = selectedTrans.length
        var numArray = []
        var newnum = 0
        for (var i = 0; i < selectedLength; i++) {
          var newnum = parseInt(selectedTrans[i])
          numArray.push(newnum)
        }


        // scrubbing the Selected List for Import against existing list of Daily Transactions
        // Thus, rebuilding the Daily Transaction array without items that were imported
        var workArray = this.state.entireData
        var totalAmountImported = 0
        var newArray = []
        var totalAmountImported = 0
        var fullArrayLength = workArray.length
        for (var i = 0; i < fullArrayLength; i++){
          var flag = false
          for (var j = 0; j < selectedLength; j++){
            if (i != numArray[j]){}
            else {
              flag = true
              totalAmountImported += parseInt(workArray[i].amount)
            }
          }
          if (flag === false){newArray.push(workArray[i])}
        }
        // assigning new scrubbed list of Daily Trans after Import back to original variables
        this.state.entireData = newArray
        this.state.data = newArray
        // adding the total of selected Daily Transactions to the existing amount of Monthly Category selected
        var currentBillAmount = parseInt(this.state.entireMonthlyData[this.state.monthlyBillSelectedIndex].amount)
        currentBillAmount += parseInt(totalAmountImported)
        this.state.entireMonthlyData[this.state.monthlyBillSelectedIndex].amount = currentBillAmount
        // show ALL TRANSACTIONS after Import
        this.refs.Show5.className="showLast5Trans"
        this.refs.ShowAll.className="hiddenButton"
        this.state.data = this.state.entireData
        // writing new Monthly data out to Firebase after Import
        var updates = {}
        var tempUser = firebase.auth().currentUser.email.split("@")
        var currentUser = tempUser[0]
        updates["/users/" + currentUser + "/" + "monthly"] = this.state.entireMonthlyData
        firebase.database().ref().update(updates)
        this.setState(this.state.entireMonthlyData)
        // writing new Dailu Transaction data out to Firebase after Import
        updates["/users/" + currentUser + "/" + "transactions"] = this.state.entireData
        firebase.database().ref().update(updates)
        // clearing variables once import is complete
        var totalAmountImported = 0
        selectedTrans = []
        // resetting Monthly Category Selected flag
        monthlyBillSelectedIndex = -1
        this.setState({monthlyBillSelectedIndex})
        // setting state to arrays so can be used elsewhere
        this.setState(this.state.data)
        this.setState(this.state.entireData)
        this.setState(this.state.entireMonthlyData)
    } else {
      monthlyBillSelectedIndex = -1
      selectedTrans = []

      // maybe put following highlight removal in function

      // reverting yellow highlight of selected Daily Transactions to import back to normal class
      var transSelect = document.getElementsByClassName("transDateSelected")
      var selectedLEN = transSelect.length
      for (var i = 0; i< selectedLEN; i++){
        transSelect.transBox.className = "transDate"
      }
      // reverting yellow highlight of selected Monthly category of import back to normal class
      var monthBillHighlight = document.getElementsByClassName("monthlyTypeSelected")
      var selectedLEN = monthBillHighlight.length
      for (var i = 0; i< selectedLEN; i++){
        monthBillHighlight.monthBox.className = "monthlyType"
      }

    }
  },
  //*********************************** Help Button Popup **********************************************
  onClickHelpButton()
  {
    alert("This will be info button how to use app. When we are unhurried and wise, we perceive that only great and worthy things have any permanent and absolute existence; that petty fears and petty pleasures are but the shadow of the reality. -Henry David Thoreau")
  },
  spendingGreenBar(){
    if (this.state.entireData != undefined){
        // determining percentage of month based on current day and 30 day month
        var currentDayPercent = (parseInt((((Date().substring(8,10)/30)*100)+.5)));
        // create total for all Daily Transactions
        var dataLength = this.state.entireData.length
        var dailyTotal = 0
        var combinedTotal = 0
        for (var i = 0; i < dataLength; i++){
          dailyTotal += parseInt(this.state.entireData[i].amount)
        }
        // find spending cash category in Monthly categories
        var dataLength = this.state.entireMonthlyData.length
        var spendingCashActual = 0
        var spendingCashPlan = 0
        for (var i = 0; i < dataLength; i++){
          if (this.state.entireMonthlyData[i].text === "spending cash"){
            spendingCashActual = this.state.entireMonthlyData[i].amount
            spendingCashPlan = this.state.entireMonthlyData[i].plan
          }
        }
        combinedTotal = dailyTotal + spendingCashActual
        var percentageSpent =  parseInt(((combinedTotal / spendingCashPlan) + .005) * 100)
        redBar = 0
        greenBar = 0
        if (percentageSpent > currentDayPercent){
          redBar = percentageSpent - currentDayPercent
          if (redBar + currentDayPercent > 100){
            redBar = 100 - currentDayPercent
          }
          greenBar = currentDayPercent.toString()+"%"

          redBar = redBar.toString() + "%"
        //  this.refs.greyBar.className="progressBarGrey_hidden"
        greyBar = 0
        } else {

          greenBar = percentageSpent
          //var currentDayPercent = (parseInt((((Date().substring(8,10)/30)*100)+.5)));
          greyBar = currentDayPercent - greenBar
          greyBar = greyBar.toString()+"%"
          greenBar = greenBar.toString()+"%"
          redBar = "0%"
          this.refs.greyBar.className="progressBarGrey"
        }
    }
  },
  userIsLoggedIn() {
    return firebase.auth().currentUser != null
  },
  //*********************************** Rendering the HTML elements *************************************
  render()
  {
    this.spendingGreenBar()
    // console.log("monthly=",this.state.monthlyFlag);
    // console.log("auth=",firebase.auth().currentUser);
    // console.log("entireMonthlyData at render=",this.state.entireMonthlyData);
    // have to set this.state.monthlyFlag when loggin out
    var monthlyPlannedTotalValue = 0
    var monthlyActualTotalValue = 0
    if (this.userIsLoggedIn() && this.state.monthlyFlag === undefined){
      return (
        <main>
          <section className="dailyTransPageBox">
            <div className="dailyTransPageSection">
              <article className="transactionTitleArea">
                <h1 className="transactionsTitle">Daily Transactions</h1>
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
             <div className="addTransBox">
                  <input  className="amountItem"
                          placeholder=" $ amount"
                          maxLength="4"
                          ref="amountInput"
                          type="number"/>
                  <input  className="descriptionItem"
                          placeholder="  description of purchase"
                          ref="descriptionInput"
                          type="text"/>
                  <button className="transSubmit"
                          type="submit"
                          onClick={this.onClickSubmit}>Add</button>
              </div>
              <article className="transOptionsArea">

                  <button className="showLast5Trans"
                          ref="Show5" onClick={this.onClickShow5}>Show Last 5 Transactions</button>
                        <button className="hiddenButton"
                          ref="ShowAll"
                          onClick={this.onClickShowAll}>    Show All Transactions    </button>
                  <button className="monthlyBudgetButton" onClick={this.onClickMonthlyBudgetButton}>Go to Monthly Budget</button>
                  <button className="signOut"
                          onClick={this.signUserOut}>Log Out</button>
              </article>
            </div>
            <article className="progressBarAreaBottom">
              <p className="progressBarGreen" style={{width : greenBar}}></p>
              <p className="progressBarGrey" ref="greyBar" style={{width : greyBar}}></p>
              <p className="progressBarRed" style={{width : redBar}}></p>
            </article>
            <div className="progressBarLabel">Progress Bar = Spending Cash + Daily Transactions</div>
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
            <button className="loginUser" onClick={this.signUserIn}>LOGIN</button>
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
        <section className="monthlyBoxCenter" ref="monthlyBox">
          <article className="monthlyTitleArea">
            <h1 className="monthlyTitle">Monthly Budget</h1>
            <h2 className="userMonthlyName"
                ref="userName">User:  {firebase.auth().currentUser.email}</h2>
          </article>
          <div className="monthlyIncomeArea">
            <p className="monthlyIncomeLabel">Monthly Income</p>
            <a className="monthlyIncomeLink" href="#">
              <p className="monthlyIncomeInput" ref="monthlyInput" onClick={this.onMonthlyIncomeInput}>${this.state.monthlyIncome}</p>
            </a>
          </div>
          <h3 className="monthlyColumnTitles">      Select                         Description                                      Planned    Actual</h3>
          <ul id="list" className="monthyBillsRecordsArea">
           {
               this.state.entireMonthlyData.map((record, i)=>{
                 if (record.type != undefined
                     && record.text != "")
                 {
                   record.plan = parseInt(record.plan, 10)
                   record.amount = parseInt(record.amount, 10)
                   if (isNaN(record.plan)){record.plan = 0}
                   if (isNaN(record.amount)){record.amount= 0}
                   monthlyPlannedTotalValue += record.plan
                   monthlyActualTotalValue += record.amount
                  if (monthlyPlannedTotalValue > this.state.monthlyIncome ){
                    mptClass = "monthlyPlannedTotal_red"
                    mptAlertClass = "monthlyPlannedTotalAlert"
                  } else {
                    mptClass = "monthlyPlannedTotal"
                    mptAlertClass = "monthlyPlannedTotalAlert_hidden"
                  }
                  if (monthlyActualTotalValue > this.state.monthlyIncome ){
                    matClass = "monthlyActualTotal_red"
                    matAlertClass = "monthlyActualTotalAlert"
                  } else {
                    matClass = "monthlyActualTotal"
                    matAlertClass = "monthlyActualTotalAlert_hidden"
                  }
                   return <article className="eachRecordContainer" key={i}>
                              <a href="#"
                                 className="monthlyType" id="monthBox" ref="monthlyType" value={i} onClick={this.onClickMonthlyTypeSelected}>
                              </a>
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
         <article className="monthlyTotalBox">
           <p className="monthlyTotalLabel">  TOTALS</p>
           <p className={mptClass}>${monthlyPlannedTotalValue}</p>
           <p className={matClass}>${monthlyActualTotalValue}</p>
         </article>
         <div className="monthlyAlertBox">
           <p className={mptAlertClass}>!!! Planned Total Expenses Exceeds Monthly Income !!!</p>
           <p className={matAlertClass}>!!! Actual Total Expenses Exceeds Monthly Income !!!</p>
         </div>
         <article className="monthlyInputsArea">
          <input  className="enterMonthlyBill"
                  placeholder="    description"
                  ref="enterMonthlyBill"
                  type="text"/>
          <input  className="enterMonthlyPlannedAmount"
                  maxLength="4"
                  placeholder="  plan $"
                  ref="enterMonthlyPlan"
                  type="number"/>
          <button className="monthlyAddItemButton"
                  type="submit"
                  onClick={this.onClickAddMonthlyBill}>Add</button>
        </article>
        <article className="monthlyOptionsArea">

            <button className="showDailyTransPage" ref="showDailyTransPage"
                  type="submit"
                  onClick={this.onShowDailyTransPage}>Show Daily Transactions</button>
            <button className="hideDailyTransPage_hidden" ref="hideDailyTransPage"
                  type="submit"
                  onClick={this.onHideDailyTransPage}>Hide Daily Transactions</button>
                <button className="dailyTransButton" ref="goToDaily" onClick={this.onClickDailyTransButton}>Go to Daily Transactions</button>
            <button className="monthlySignOut" onClick={this.signUserOut}>Log Out</button>
        </article>
        </section>
        <div className="monthlyDailyTransBox_hidden" ref="monthlyDailyTransBox">
          <section className="monthlyDailyTransBoxInner" >

              <article className="transactionTitleArea">
                <h1 className="transactionsTitle">Daily Transactions</h1>
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
                                <a href="#" className="transDate" id="transBox" ref="transDate" value={i} onClick={this.onClickSelectedTrans}>{record.date}</a>
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
             <div className="addTransBox">
                  <input  className="amountItem"
                          maxLength="4"
                          placeholder=" $ amount"
                          ref="amountInput"
                          type="number"/>
                  <input  className="descriptionItem"
                          placeholder="  description of purchase"
                          ref="descriptionInput"
                          type="text"/>
                  <button className="transSubmit"
                          type="submit"
                          onClick={this.onClickSubmit}>Add</button>
              </div>
              <button className="showLast5Trans"
                      ref="Show5" onClick={this.onClickShow5}>Show Last 5 Transactions</button>
              <button className="hiddenButton"
                      ref="ShowAll"
                      onClick={this.onClickShowAll}>    Show All Transactions    </button>
              <button className="importButton" onClick={this.onClickImportButton}>Import Transactions</button>
            </section>
            <article className="progressBarAreaBottom">
              <p className="progressBarGreen" style={{width : greenBar}}></p>
              <p className="progressBarGrey" ref="greyBar" style={{width : greyBar}}></p>
              <p className="progressBarRed" style={{width : redBar}}></p>
            </article>
         <div className="progressBarLabel">Progress Bar = Spending Cash + Daily Transactions</div>
       </div>
   </main>
    )
  }
})
