import { Router } from 'wouter';
import './App.css';
import { Nav, RoutePages } from './Router';
const App = () => (
    <>
        <Router base="/">
        <body>
            <header>
                <Nav/>
            </header>
            <main>
                <RoutePages/>
            </main>
        </body>
        <footer>Hi</footer>
        </Router>
    </>
);

export default App;