/*   This script creates a chat room where user can read stored chats and user has ability
    to add chat messages. All chats are stored along with date on external server.
    The user has the option to click button to show only last 15 chat messages or click button to
    show all messages  */
import React from 'react'
import Validator from 'validator'
import { ajax } from 'jquery'

/*
var userId = firebase.auth().currentUser.uid;
return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  var username = snapshot.val().username;
  // ...
});
*/
var userId = "jeremy2929"
//var userId = firebase.auth().currentUser.uid;
console.log("user=",userId);
var database = firebase.database();

export default React.createClass({
  componentDidMount(){
      ajax({
      url: "https://tiny-tiny.herokuapp.com/collections/jeremy2929-test",
      dataType: "json",
      success: this.onInitialAjaxLoadSuccess,
      error: this.onAjaxLoadError
    })



  //  return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  //    var username = snapshot.val().username;
      // ...
  //  });


    function writeUserData(data) {
firebase.database().ref('/users/' + userId).set({
  data:
  {
    amount: amountInputValue,
      text: textInputValue,
      date: currentDate
  }
});
}



  },
  getInitialState(){
    return{
      textValue: "",
      textMsgs: ["text messages"],
      data: [""]
    }

  },
  onInitialAjaxLoadSuccess(response){
    var holdResponse = response.reverse()
    this.setState({
      textMsgs: holdResponse,
      data: holdResponse
    })


  },
  onPostAjaxLoadSuccess(response){
    this.setState({
      textMsgs: this.state.textMsgs.concat(response),
      data: this.state.data.concat(response)

  },
  onAjaxLoadError(response){
    alert("Failure to connect to URL")
  },
  onClickSubmit(e){
    var currentDate = Date().substring(4,16)
    e.preventDefault()
    var textInputValue = this.refs.textInput.value
    var amountInputValue = this.refs.amountInput.value
    if (textInputValue != ""){


      function writeUserData(data) {
  firebase.database().ref('users/' + "jeremy2929@twc.com").set({
    data:
    {
      amount: amountInputValue,
        text: textInputValue,
        date: currentDate
    }
  });
  }

      ajax({
        url: "https://tiny-tiny.herokuapp.com/collections/jeremy2929-test",
        dataType: "json",
        type: "POST",
        data:
            {
              amount: amountInputValue,
                text: textInputValue,
                date: currentDate
            },
        success: this.onPostAjaxLoadSuccess,
        error: this.AjaxLoadError
      })
      var showing = this.refs.Show8.className
      if (showing==="hiddenButton"){
        var dataLength = this.state.data.length-8
        this.state.data=[]
        for (var j = dataLength;j<dataLength+8; j++){
          this.state.data[j]=this.state.textMsgs[j]
        }
      }
      this.refs.textInput.value = ""
      this.refs.amountInput.value = ""
    }
    this.setState(this.state.data)
    this.setState(this.state.textMsgs)
  },
  onClickShowAll(){
    this.refs.Show8.className="recentView"
    this.refs.ShowAll.className="hiddenButton"
    this.state.data = this.state.textMsgs
    this.setState(this.state.data)
  },
  onSignOut(){
    console.log("sign out");
    document.getElementById('signin_main').className="mdl-layout__header mdl-color-text--whitemdl-color--light-blue-700"
    document.getElementById('signin_header').className="hidden"
    document.getElementById('detailsPage').className="pageSection"
    location.window.reload(true)
  //  document.getElementById('app').class="mdl-layout__header mdl-color-text--white mdl-color--light-blue-700"

  },
  onClickShow8(){
    this.refs.ShowAll.className="recentView"
    this.refs.Show8.className="hiddenButton"
    this.state.data=this.state.textMsgs
    var dataLength = this.state.data.length-8
    this.state.data=[]
    for (var j = dataLength;j<dataLength+8; j++){
      this.state.data[j]=this.state.textMsgs[j]
    }
    this.setState(this.state.data)
    // <button className="visibleSignOut" id="quickstart-sign-in" name="signin" >Sign Out</button>

  },

  render() {
    return(
    <main id="details_main">
      <section id="detailsPage" className="hidden">


          <h1 className="liteTitle">DollarTrack</h1>
            <ul id="list" className="newList">
              {

                this.state.data.map((record, i)=>{
                  if (record.amount != undefined && record.text != ""){
                    return <article className="itemBox">
                              <p key="1" className="transDate">{record.date}</p>
                              <p key="3" className="amountBox">{record.amount}</p>
                              <p key="2" className="descriptionBox" key={i}>{record.text}</p>
                            </article>
                  }
              })
            }
            </ul>
            <input className="amountItem" placeholder="amount" ref="amountInput" type="text"/>
            <input className="descriptionItem" placeholder="item description" ref="textInput" type="text"/>
            <input className="createChat" type="submit" onClick={this.onClickSubmit}/>
            <button className="hiddenButton" ref="Show8" onClick={this.onClickShow8}>Show Last 8 Transactions Only</button>
            <button className="recentView" ref="ShowAll" onClick={this.onClickShowAll}>    Show All Transactions    </button>
      </section>
    </main>
    )
  }
})
