/*   This script creates a chat room where user can read stored chats and user has ability
    to add chat messages. All chats are stored along with date on external server.
    The user has the option to click button to show only last 15 chat messages or click button to
    show all messages  */
import React from 'react'
import Validator from 'validator'
import { ajax } from 'jquery'
var user = "none"
export default React.createClass({
  componentDidMount(){

  },
  getInitialState(){
    return{
      textValue: "",
      allData: ["text messages"],
      data: [""]
    }
    this.setState({user})

  },


  onInitialAjaxLoadSuccess(response){
    var holdResponse = response.reverse()
    this.setState({
      database: holdResponse,
      allData: holdResponse,
      data: holdResponse
    })
    var databaseLength = this.state.database.length
    var j = 0
    this.state.data = []
    for (var i = 0; i < databaseLength; i++){

      if (this.state.database[i].user != undefined && this.state.database[i].password != undefined){

              if (this.state.database[i].user === this.state.user
                  && this.state.database[i].password === this.state.pswd)
                {
                  this.state.data[j] = this.state.database[i]
                  j++
                }
        }
    }
    this.state.allData = this.state.data
    this.setState(this.state.data)
    console.log("Alldata=",this.state.allData);
    console.log("data=",this.state.data);
  },
  onPostAjaxLoadSuccess(response){
    this.setState({
      database: this.state.allData.concat(response),
      allData: this.state.allData.concat(response),
      data: this.state.data.concat(response)
    })
  },
  onAjaxLoadError(response){
    alert("Failure to connect to URL")
  },
  onSubmitUser(e){
    var user = this.refs.userInput.value
    var pswd = this.refs.passwordInput.value
    this.refs.userInput.value = ""
    this.refs.passwordInput.value = ""
    this.setState({user})
    this.setState({pswd})
    //************************************
    // mount ajax
    //************************************
    ajax({
    url: "https://tiny-tiny.herokuapp.com/collections/jeremy2929-test1",
    dataType: "json",
    success: this.onInitialAjaxLoadSuccess,
    error: this.onAjaxLoadError
    })
  },
  onSignOut(){
    var user = "none"
    var pswd = "none"
    this.setState({user})
  },
  onClickSubmit(e){
    var currentDate = Date().substring(4,16)
    e.preventDefault()
    var textInputValue = this.refs.descriptionInput.value
    var amountInputValue = this.refs.amountInput.value
    var userID = this.state.user
    var passwordID = this.state.pswd
    if (textInputValue != ""){
      ajax({
        url: "https://tiny-tiny.herokuapp.com/collections/jeremy2929-test1",
        dataType: "json",
        type: "POST",
        data:
            {
              user: userID,
              password: passwordID,
              date: currentDate,
              text: textInputValue,
            amount: amountInputValue,
            },
        success: this.onPostAjaxLoadSuccess,
        error: this.AjaxLoadError
      })
      var showing = this.refs.Show15.className
      if (showing==="hiddenButton"){
        var dataLength = this.state.data.length-5
        if (dataLength>5){
            this.state.data=[]
            for (var j = dataLength;j<dataLength+5; j++){
              this.state.data[j]=this.state.allData[j]
            }
        }
      }
      this.refs.descriptionInput.value = ""
      this.refs.amountInput.value = ""
    }
    this.setState(this.state.data)
    this.setState(this.state.allData)
  },
  onClickShowAll(){

    this.refs.Show15.className="visibleButton"
    this.refs.ShowAll.className="hiddenButton"
    this.state.data = this.state.allData
    this.setState(this.state.data)
  },
  onClickShow15(){
    console.log("before=",this.state.data);
    console.log("before=",this.state.allData);
    this.refs.ShowAll.className="visibleButton"
    this.refs.Show15.className="hiddenButton"
    var dataLength = this.state.allData.length
console.log("len=",dataLength);
    if (dataLength>4){
        this.state.data=[]
        for (var j = 0;j<5; j++){
          console.log(j);
          this.state.data[j]=this.state.allData[j]
          this.setState(this.state.data)
        }

    }
    console.log("after=",this.state.data);
    console.log("after=",this.state.allData);
    this.setState(this.state.data)

  },
  render() {
  console.log("render=",this.state.allData);
    if (this.state.user === undefined || this.state.user === "none"){
    return(
    <main>
      <section>
          <article className="loginTitleSection">
            <img className="loginImage" src="styles/titleLogin.jpg"></img>
            <h1 className="titleLogin">DollarTrak</h1>
            <img className="loginImage" src="styles/titleLogin.jpg"></img>
          </article>
          <p>Login</p>
          <input className="userNameInput" ref="userInput"></input>
          <input className="passwordInput" ref="passwordInput"></input>
          <button className="submitUser" onClick={this.onSubmitUser}></button>
      </section>
    </main>
  )
} else if (this.state.user != undefined || this.state.user != "none"){
     return (
      <main>
        <section className="pageSection">
          <h1 className="chatTitle">Daily Transactions</h1>
            <ul id="list" className="newList">
              {
                this.state.data.map((record, i)=>{
                  if (record.date != undefined
                   && record.text != "")
                   {
                    return <article className="eachRecordContainer" key={i}>
                              <p className="transDate">{record.date}</p>
                              <p className="transAmount">{record.amount}</p>
                              <p className="transDesc">{record.text}</p>
                              <p className="transID">{record.user}</p>
                            </article>
                  }
              })
            }
            </ul>
            <input className="amountItem" placeholder="amount" ref="amountInput" type="text"/>
            <input className="descriptionItem" placeholder="enter description" ref="descriptionInput" type="text"/>
            <button className="createChat" type="submit" onClick={this.onClickSubmit}>Submit</button>
            <button className="visibleButton" ref="Show15" onClick={this.onClickShow15}>Show Last 5 Transactions Only</button>
            <button className="hiddenButton" ref="ShowAll" onClick={this.onClickShowAll}>    Show All Transactions    </button>
            <button className="signOut" onClick={this.onSignOut}>Sign out</button>
      </section>
    </main>
  )
  }

  }
})
