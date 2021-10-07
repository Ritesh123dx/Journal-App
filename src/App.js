import './App.css';
import Entries from './Components/Entries';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from './Components/Main';
import Navbar from './Components/Navbar';
import SignUp from './Components/SignUp';
import SignIn from './Components/SignIn';


function App() {
  return (
    <Router>


      <Switch>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/signin">
          <SignIn />
        </Route>
        <div className="App text-center">
          <Navbar />
          <Route exact={true} path="/">
            <Main />
            
          </Route>

          <Route path="/entries">
            <Entries />
          </Route>
        </div>
      </Switch>


    </Router>
  );
}

export default App;
