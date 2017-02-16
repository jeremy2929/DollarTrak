import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Main from '../js/main'

jest.mock('../js/external_firebase')

describe("Main", ()=>{
  let mainComponent = {}
  beforeEach(() => {
    mainComponent = TestUtils.renderIntoDocument(<Main/>)
  })

  var fbAuthCurrentUserMock = jest.fn(e => {
     user = { authed: false }
   })


  it("Should render a LOGIN button'", ()=>{
    const currentLoginButtonElements = mainComponent.refs.loginButton

    expect(currentLoginButtonElements.textContent).toEqual("LOGIN")
  })

  it("Should render a HELP button", ()=>{
      const currentHelpButtonElements = mainComponent.refs.helpButton
      expect(currentHelpButtonElements.textContent).toBe("HELP")
      })
var user = "xxx"
  it("It should call the onShowDailyPage function", () => {
  var fbAuthCurrentUser = jest.fn(e => {
     return "test"
   })
   let test = true
   let monthlyFlag = true
   mainComponent.setState({monthlyFlag: true})
  // mainComponent.setState({fbAuthCurrentUser(){}})
   mainComponent = TestUtils.renderIntoDocument(<Main monthlyFlag={test}/>)
 //component = TestUtils.renderIntoDocument(<Ancestor heirlooms={heirlooms}/>);console.log(mainComponent);
   let ShowDailyButton = mainComponent.refs.showDailyTransPage
console.log(mainComponent);
console.log("fbAuth=",fbAuthCurrentUser());
console.log("mf=",monthlyFlag);
console.log("show=",ShowDailyButton);
         TestUtils.Simulate.click(ShowDailyButton)
         expect(this.onShowDailyTransPage).toBeCalled()
      })
})


//(fbAuthCurrentUser() != null && this.state.monthlyFlag === true)

//
//
// let imgElement = headerComponent.refs.userImage
//
// ref="loginButton"
//






//
// import React from "react"
// import TestUtils from "react-addons-test-utils"
//
// import Main from "../js/main.js"
//
// describe("Main", () => {
//   let mainComponent = {}
//
//   beforeEach(()=>{
//     // This is NOT a reference to the element in the page...
//     //   it IS a reference to the component code
//     mainComponent = TestUtils.renderIntoDocument(<Main />)
//   })
//
//   it("Should render a LOGIN button'", ()=>{
//     const currentLoginButtonElements = TestUtils.findRenderedDOMComponentsWithClass(
//       mainComponent,
//       "loginUser"
//     )
//     expect(currentLoginButtonElements.textContent).toBe("LOGIN")
//   })
//   // it("Should display post title'", ()=>{
//   //   const currentTitleDateElements = TestUtils.scryRenderedDOMComponentsWithClass(
//   //     postComponent,
//   //     "postTitle"
//   //   )
//   //   expect(currentTitleDateElements[0].textContent).toBe("1.   Spurs vs Rockets")
//   // })
//   // it("Create page should have a submit button", ()=>{
//   //   const createSubmitButtonElementsubmitPost = TestUtils.scryRenderedDOMComponentsWithClass(postComponent, "submitPost")
//   //   expect(createSubmitButtonElementsubmitPost).toBeDefined()
//   // })
//   // it("Detail page should have a home button", ()=>{
//   //   const createHomeButtonElement = TestUtils.scryRenderedDOMComponentsWithClass(postComponent, "homeButton")
//   //   expect(createHomeButtonElement).toBeDefined()
//   // })
