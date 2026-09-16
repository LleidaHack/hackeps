import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "src/config/routes";
import hacker from "src/assets/img/home10/marraco-hacker-raw.png";
import mentor from "src/assets/img/home10/marraco-mentor-raw.png";
import "./UserEnter.css";

const LinkAccounts = () => {
  const { state } = useLocation();
  return (
    <section className="account-welcome">
      <h1>Benvingut/da!</h1>
      <Link
        className="account-welcome-login"
        to={ROUTES.login}
        state={{ ...state, showLogin: true }}
      >
        Inicia sessió
      </Link>
      <div className="account-welcome-divider"><span>o també</span></div>
      <h2>Crea un compte</h2>
      <div className="account-welcome-options">
        <Link className="account-welcome-option" to={ROUTES.hackerForm}>
          <div className="account-welcome-art account-welcome-art--hacker">
            <img src={hacker} alt="" width={518} height={509} />
          </div>
          <span>HACKER</span>
        </Link>
        <Link className="account-welcome-option" to={ROUTES.contactMentor}>
          <div className="account-welcome-art account-welcome-art--mentor">
            <img src={mentor} alt="" width={526} height={523} />
          </div>
          <span>MENTOR</span>
        </Link>
      </div>
    </section>
  );
};

export default LinkAccounts;
