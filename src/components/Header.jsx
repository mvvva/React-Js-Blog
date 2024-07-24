import { Link } from 'react-router-dom';

const Header = ({ title }) => {
    return (
        <header className="Header">
            <h1>
                <Link style={{textDecoration:'none', color:'#333'}} to="/">{title}</Link>
            </h1>
        </header>
    );
};

export default Header;

