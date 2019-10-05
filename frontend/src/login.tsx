import React from "react";
import { Stack, TextField, PrimaryButton } from "office-ui-fabric-react";

interface IProps {
  onLogin: (user: any) => void;
}
const SESSION_USERID_NAME = "userId";

export class Login extends React.Component<IProps> {
  state = {
    userName: "",
    userEmail: "",
    loading: false
  };

  componentDidMount() {
    this.getUserFromSession();
  }

  getUserFromSession = () => {
    this.setState({ loading: true });
    let userId = localStorage.getItem(SESSION_USERID_NAME);
    if (userId) {
      fetch("/_api/user/" + userId)
        .then(result => result.json())
        .then(user => {
          if (user && user.name) {
            this.setState({
              userName: user.name,
              userEmail: user.email,
              loading: false
            });
            this.props.onLogin(user);
          }
        });
    }
  };

  saveUser = () => {
    let user = {
      name: this.state.userName,
      email: this.state.userEmail
    };
    fetch("/_api/user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
      .then(result => result.json())
      .then(newUser => {
        localStorage.setItem(SESSION_USERID_NAME, newUser._id);

        this.props.onLogin(newUser);
      });
  };

  render() {
    return (
      <Stack
        gap={15}
        style={{
          boxShadow: "0px 0px 6px rgba(0,0,0,.3)",
          background: "#ffffff",
          padding: "30px"
        }}
      >
        <TextField
          label="Name"
          onChange={(e, value) => {
            this.setState({ userName: value });
          }}
          value={this.state.userName}
        />
        <TextField
          label="Email"
          onChange={(e, value) => {
            this.setState({ userEmail: value });
          }}
          value={this.state.userEmail}
        />
        <PrimaryButton
          onClick={() => {
            this.saveUser();
          }}
        >
          Login
        </PrimaryButton>
      </Stack>
    );
  }
}
