import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, NavLink, Navigate, useLocation } from "react-router-dom";
import "./Profile.css";
import Modal from "react-bootstrap/Modal";
import { loadProfile } from "src/modules/loadProfile";
import { clearSession } from "src/modules/session";
import EditProfile from "./EditProfile";
import { memberSince } from "src/modules/memberSince";
import qrIcon from "src/icons/qr.png";

//import Medals from "src/components/Medals/Medals";
//import Calendar from "react-calendar/dist/umd/Calendar";
import Team from "src/components/hackeps/Team/Team";
import LinkAccounts from "src/components/hackeps/LinkAccounts/LinkAccounts";
import Join from "src/components/hackeps/Join/Join";
import QrCode from "src/components/hackeps/QrCode/QrCode.js";
import ProfilePic from "../ProfilePic/ProfilePic";
import ProfileHighlights from "./ProfileHighlights";

const ProfileComponent = () => {
  const { hacker_id } = useParams();
  const { pathname } = useLocation();
  const section = pathname.split("/")[2] || "";
  const userId = hacker_id || localStorage.getItem("userID");
  const isUser = String(userId) === localStorage.getItem("userID");
  const [loadError, setLoadError] = useState(false);
  const [isHacker, setIsHacker] = useState(false);

  const [showQR, setShowQR] = useState(false);
  const handleShowQR = () => setShowQR(true);
  const handleCloseQR = () => setShowQR(false);

  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [event, setEvent] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setUser(null);
    setTeam(null);
    setEvent(null);
    setQrCode(null);
    setTicket(null);
    setIsHacker(false);
    setLoadError(false);
    loadProfile(userId)
      .then((data) => {
        if (cancelled) return;
        setUser(data.user);
        setTeam(data.team);
        setEvent(data.event);
        setQrCode(data.qrCode);
        setTicket(data.ticket);
        setIsHacker(data.isHacker);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  function logOut() {
    clearSession();
  }

  if (loadError)
    return (
      <p role="alert" className="p-6 text-center text-white">
        No hem pogut carregar el perfil. Torna-ho a provar més tard.
      </p>
    );

  return (
    <>
      <main className="hacker-profile">
        <div className="hacker-profile-content">
          <header className="hacker-profile-header">
            <div className="hacker-profile-avatar">
              <ProfilePic
                id="profile-pic-big"
                hacker={user}
                size="big"
                bgcolor="white"
                border
                is_profile
              />
            </div>
            <div className="hacker-profile-identity">
              <p>{isUser ? "Benvingut/da, hacker!" : "Perfil de hacker"}</p>
              <h1>{user ? user.name : "Carregant el perfil…"}</h1>
              {user?.created_at && (
                <p className="hacker-profile-membership">
                  {memberSince(user.created_at)}
                </p>
              )}
            </div>
            {isUser && event?.accepted && event?.confirmed && user && (
              <button
                type="button"
                className="hacker-profile-ticket"
                onClick={handleShowQR}
              >
                <span>{ticket?.checkedIn ? "Check-in fet" : "Mostra el teu tiquet"}</span>
                <img src={qrIcon} alt="" width="48" height="48" />
              </button>
            )}
          </header>

          {isUser ? (
            <div className="profile-workspace">
              <nav className="profile-navigation" aria-label="Àrea personal">
                {isHacker && <NavLink to="/perfil/esdeveniments">Esdeveniments</NavLink>}
                {isHacker && <NavLink to="/perfil/equip">El meu equip</NavLink>}
                <NavLink to="/perfil/dades">El meu perfil</NavLink>
                <Link to="/" className="profile-signout" onClick={logOut}>Tancar sessió</Link>
              </nav>
              <div className="profile-panel" key={section}>
                {!user ? <p role="status">Carregant el perfil…</p> : section === "dades" ? (
                  <>
                    <h2>El meu perfil</h2>
                    <p className="profile-description">Actualitza les teves dades, la foto i els enllaços professionals.</p>
                    <div className="hacker-profile-actions"><EditProfile hackerObj={user} onSaved={setUser} /></div>
                    <div className="hacker-profile-accounts"><LinkAccounts hacker={user} /></div>
                  </>
                ) : section === "esdeveniments" && isHacker ? (
                  <>
                    <h2>Esdeveniments</h2>
                    <p className="profile-description">Consulta la teva inscripció i les dates de la HackEPS.</p>
                    <div className="profile-event-grid">
                      <div className="hacker-profile-event"><Join event={event} /></div>
                      <ProfileHighlights event={event} />
                    </div>
                  </>
                ) : section === "equip" && isHacker ? (
                  <>
                    <h2>El meu equip</h2>
                    {event?.registered ? <Team team={team} is_user={true} onTeamChange={setTeam} /> : (
                      <div className="profile-summary-card">
                        <p>Inscriu-te a la HackEPS per crear un equip o unir-te a un.</p>
                        <Link className="profile-primary-link" to="/perfil/esdeveniments">Veure l’esdeveniment</Link>
                      </div>
                    )}
                  </>
                ) : (
                  <Navigate to={isHacker ? "/perfil/esdeveniments" : "/perfil/dades"} replace />
                )}
              </div>
            </div>
          ) : user && (
            <>
              <div className="hacker-profile-accounts"><LinkAccounts hacker={user} /></div>
              {event?.registered && isHacker && <section className="hacker-profile-team" aria-label="Equip"><Team team={team} is_user={false} /></section>}
            </>
          )}
        </div>
      </main>

      <Modal show={showQR} onHide={handleCloseQR} centered>
        <QrCode url={qrCode} ticket={ticket} />
      </Modal>
    </>
  );
};

export default ProfileComponent;
