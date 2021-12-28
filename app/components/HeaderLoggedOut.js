import React, { useEffect, useState, useContext } from "react"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import DispatchContext from "../DispatchContext"

function HeaderLoggedOut(props) {
  const initialState = {
    username: {
      value: "",
      hasErrors: false
    },
    password: {
      value: "",
      hasErrors: false
    },
    submitCount: 0
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "validateUsername":
        draft.username.hasErrors = false
        draft.username.value = action.value
        if (!draft.username.value) {
          draft.username.hasErrors = true
        }
        return
      case "validatePassword":
        draft.password.hasErrors = false
        draft.password.value = action.value
        if (!draft.password.value) {
          draft.password.hasErrors = true
        }
        return
      case "submitForm":
        if (!draft.username.hasErrors && !draft.password.hasErrors) {
          draft.submitCount++
        }
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  const appDispatch = useContext(DispatchContext)

  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: "validateUsername", value: state.username.value })
    dispatch({ type: "validatePassword", value: state.password.value })
    dispatch({ type: "submitForm" })
  }

  useEffect(() => {
    if (state.submitCount) {
      async function submitForm() {
        try {
          const response = await Axios.post("/login", { username: state.username.value, password: state.password.value })
          if (response.data) {
            appDispatch({ type: "login", data: response.data })
            appDispatch({ type: "flashMessage", value: "You have successfully logged in." })
          } else {
            console.log("Incorrect username/password")
            appDispatch({ type: "flashMessage", value: "Invalid username/password" })
          }
        } catch (e) {
          console.log("There was a problem")
        }
      }
      submitForm()
    }
  }, [state.submitCount])

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => dispatch({ type: "validateUsername", value: e.target.value })} name="username" className={"form-control form-control-sm input-dark " + (state.username.hasErrors ? "is-invalid" : "")} type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => dispatch({ type: "validatePassword", value: e.target.value })} name="password" className={"form-control form-control-sm input-dark " + (state.password.hasErrors ? "is-invalid" : "")} type="password" placeholder="Password" />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  )
}

export default HeaderLoggedOut
