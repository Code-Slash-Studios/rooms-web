import {Switch, Route, Link} from "wouter";
import Today from "./pages/Today"
//https://github.com/molefrog/wouter/blob/v3/README.md

export const Nav = () => {

    return <>
        <Link href="/today">Today</Link>
        <Link href="/backlog">Forever</Link>
        <Link href="/you">You</Link>
    </>
}


export const RoutePages = () => (
    <>
        <Switch>
            <Route path="/you">
                <h2>You are special :)</h2>
            </Route>
            <Route path="backlog">
                <h2>Forever is a very long time</h2>
            </Route>
            <Route path="/today" component={Today}/>
            <Route path="/" component={Today}></Route>
            {/* Default route in a switch */}
            <Route><h1 style={{color: 'red'}}>404: route not found</h1></Route>
        </Switch>
    </>
);

export default RoutePages;