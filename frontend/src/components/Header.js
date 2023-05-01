import { Link, useLocation, useHistory, Route } from "react-router-dom";
import logo from "../images/logo.svg";

export function Header({ ...props }) {
  const location = useLocation();
  const history = useHistory();
  const logOut = () => {
    history.push("/login");
    props.handleLogout();
  };

  switch (location.pathname) {
    case "/login":
      return (
        <header className="header">
          <div className="header__registration">
            <img className="header__logo" src={logo} alt="logo" />
            <Link className="header__link" to="/register">
              Sign up
            </Link>
          </div>
        </header>
      );
    case "/register":
      return (
        <header className="header">
          <div className="header__registration">
            <img className="header__logo" src={logo} alt="logo" />
            <Link className="header__link" to="/login">
              Log in
            </Link>
          </div>
        </header>
      );
    default:
      return (
        <header className="header">
          <div className="header__registration">
            <img className="header__logo" src={logo} alt="logo" />
            <div className="header__nav">
              <p className="header__nav_email">{props.email}</p>
              <a className="header__link" onClick={logOut}>
                Log out
              </a>
            </div>
          </div>
        </header>
      );
  }
}
