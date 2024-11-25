import logo from './logo.svg';
import './App.css';

export default function App() {
    return (
        <div className='App'>
            {/**TODO temporary boilerplate */}
            <header className='App-header'>
                <img src={logo} className="App-logo" alt="logo" />
                <h1>Hello World!</h1>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    )
}