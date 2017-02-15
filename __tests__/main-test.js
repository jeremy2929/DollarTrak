import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Main from '../js/main'

jest.mock('../js/__mocks__/firebase_mock')

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


})


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
// })
