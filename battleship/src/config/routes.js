import { React } from 'react';
import { Switch, Route } from 'react-router-dom';
import GamePage from "../pages/GamePage"
import MainPage from './../pages/MainPage';

const Routes = (props) => {
    return (
        <Switch>
            <Route path="/game/:teamCode">
                <GamePage {...props} />
            </Route>
            <Route path="/">
                <MainPage />
            </Route>
        </Switch>
    )
}

export default Routes;