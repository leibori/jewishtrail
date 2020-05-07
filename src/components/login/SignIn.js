import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import  config  from "../firebase/firebase.js";
import { AuthContext } from "./Auth.js";
import { useAlert } from 'react-alert'

const alert = useAlert()
const SignIn = ({ history }) => {
  const handleLogin = useCallback(
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await config
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push("/");
      } catch (error) {
        alert.show(error)
      }
    },
    [history]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/Menu" />;
  }

  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" />
        </label>
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
};

export default withRouter(SignIn);