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
  it("It should click the LOGIN button and change value of user variable from false to true", () => {
      expect(mainComponent.state.user.authed).toBeFalsy()
      let loginButtonComponent = mainComponent.refs.loginButton
      TestUtils.Simulate.click(loginButtonComponent)
      expect(mainComponent.state.user.authed).toBeTruthy()
  })
  it("It should render an input for description of transaction", () => {
      let descriptionInputComponent = mainComponent.refs.descriptionInput
      expect(descriptionInputComponent.placeholder).toEqual("  description of purchase")
  })
  it("It should render a title Daily Transactions", () => {
      let transactionsTitleInputComponent = mainComponent.refs.transactionsTitle
      expect(transactionsTitleInputComponent.textContent).toEqual("Daily Transactions")
  })

  it("It should test main component", () => {
      let monthlyBudgetButtonComponent = mainComponent.refs.monthlyBudgetButton
  })
})
