import React from "react";
import "./App.css";
import { Fabric, Stack, Text } from "office-ui-fabric-react";
import { Login } from "./login";
import { Bierliste } from "./Bierliste";

interface IUser {
  _id: string;
  name: string;
  email: string;
  date: Date;
}
interface IProps {}
interface IState {
  user?: IUser;
}

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }
  render() {
    console.log(this.state);
    return (
      <Fabric style={{ padding: "10px", maxWidth: "500px", margin: "0 auto" }}>
        <Stack tokens={{childrenGap:10}}>
          <Stack horizontal tokens={{ childrenGap: 15 }} horizontalAlign="baseline">
            <img src="logo.png" alt="1. FC Spich" style={{ width: "50px" }} />
            <Text variant="xxLarge">Spicher Bierliste</Text>
          </Stack>

          <div>
            {!this.state.user && (
              <Login
                onLogin={user => {
                  this.setState({ user });
                }}
              />
            )}
          </div>
          <div>
            {this.state.user && <Bierliste userId={this.state.user._id} />}
          </div>
        </Stack>
      </Fabric>
    );
  }
}
export default App;
