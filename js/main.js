import React from 'react'
import { ajax } from 'jquery'
var user = "none"
export default React.createClass({
  componentDidMount(){
    //@TODO: remove this if not used
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

      if (this.state.database[i].user != undefined && this.state.database[i].password != undefined)
        {

          if (this.state.database[i].user === this.state.user
              && this.state.database[i].password === this.state.pswd)
            {
              this.state.data[j] = this.state.database[i]
              j++
            }
        }
    }
//*********************************************************************
    //@TODO  if new user with no records, need to set at least one record with user ID
    console.log("j=",j);
    if (j === 0){this.state.data[0].user = "jj"}
//*********************************************************************
    this.state.allData = this.state.data
    var dataStart = this.state.allData.length-5
    if (dataStart > 0){
        this.state.data = []
        for (var j = 0; j < 5; j++){
          this.state.data[j]=this.state.allData[dataStart+j]
        }
    }
    this.setState(this.state.data)
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
      var dataStart = this.state.allData.length-5
      if (dataStart > 0){
          this.state.data = []
          for (var j = 0; j < 5; j++){
            this.state.data[j]=this.state.allData[dataStart+j]
          }
      }
      this.refs.descriptionInput.value = ""
      this.refs.amountInput.value = ""
    }
    this.setState(this.state.data)
    this.setState(this.state.allData)
  },
  onClickShowAll(){
    this.refs.Show5.className = "visibleButton"
    this.refs.ShowAll.className = "hiddenButton"
    this.state.data = this.state.allData
    this.setState(this.state.data)
  },
  onClickShow5(){
    this.refs.ShowAll.className = "visibleButton"
    this.refs.Show5.className = "hiddenButton"
    var dataStart = this.state.allData.length-5
    if (dataStart > 0){
        this.state.data = []
        for (var j = 0; j < 5; j++){
          this.state.data[j]=this.state.allData[dataStart+j]
        }
    }
    this.setState(this.state.data)
  },
  render() {
  //  this.state.user = "jw"
  // <h2 className="loginLabel">Login Screen:</h2>

    if (this.state.user === undefined || this.state.user === "none")
    {
      return(
        <main>
          <section className="loginPage">
              <article className="loginTitleSection">
                <img className="loginImage" src="styles/titleLogin.jpg"></img>
                <h1 className="titleLogin">DollarTrak</h1>
                <img className="loginImage" src="styles/titleLogin.jpg"></img>
              </article>
              <article className="loginButtonsSection">
                <h2 className="loginLabel">     </h2>
                <input className="userNameInput" placeholder="  user name" ref="userInput"></input>
                <input className="passwordInput" placeholder="  password" ref="passwordInput"></input>
                <button className="submitUser" onClick={this.onSubmitUser}>LOGIN</button>
              </article>
          </section>
        </main>
      )
    } else if (this.state.user != undefined || this.state.user != "none")
      {
        return (
          <main>
            <section className="pageSection">
              <h1 className="transactionsTitle">DollarTrak - Daily Transactions</h1>
              <h2 className="userName" ref="userName">User:  {this.state.data[0].user}</h2>
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
              <input className="amountItem" placeholder=" $ amount" ref="amountInput" type="text"/>
              <input className="descriptionItem" placeholder="  description of purchase" ref="descriptionInput" type="text"/>
              <button className="createChat" type="submit" onClick={this.onClickSubmit}>Submit</button>
              <button className="hiddenButton" ref="Show5" onClick={this.onClickShow5}>Show Last 5 Transactions Only</button>
              <button className="visibleButton" ref="ShowAll" onClick={this.onClickShowAll}>    Show All Transactions    </button>
              <button className="signOut" onClick={this.onSignOut}>Log Out</button>
            </section>
          </main>
        )
      }
    }
})
