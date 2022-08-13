import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Title from './routes/Title';
import Main from './routes/Main';
import Login from './routes/Login';
import User from './routes/User';
import Create from './routes/Create';

function App() {

  const [start, setStart] = React.useState(false);

  function toggleStart(){
    setStart(true);
  }

  return (
    <div className="app">
      <BrowserRouter>
        <Switch>
        <Route path='/Main'>
            <Main />
          </Route>
          <Route path='/Login'>
            <Login />
          </Route>
          <Route path='/User'>
            <User />
          </Route>
          <Route path='/Create'>
            <Create />
          </Route>
          <Route path='/'>
            <Title />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );

}

export default App;
