import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Room from "./backend/room"

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact/>
                <Route path="/room/:roomID" component={Room} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
