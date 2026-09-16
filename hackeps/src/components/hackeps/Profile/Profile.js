import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, NavLink, useLocation } from "react-router-dom";
import "./Profile.css";
import Modal from "react-bootstrap/Modal";
import { loadProfile } from "src/modules/loadProfile";
import { clearSession } from "src/modules/session";
import EditProfile from "./EditProfile";
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setUser(null);
    setTeam(null);
    setEvent(null);
    setQrCode(null);
    setIsHacker(false);
    setLoadError(false);
    loadProfile(userId)
      .then((data) => {
        if (cancelled) return;
        setUser(data.user);
        setTeam(data.team);
        setEvent(data.event);
        setQrCode(data.qrCode);
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

  function generateMemberTime(creationDate) {
    let first = new Date(creationDate);
    let now = Date.now();

    let seconds = (now - first) / 1000;
    let days = seconds / 60 / 60 / 24;

    if (days > 365) return `${~~(days / 365)} anys`;

    if (days > 30) return `${~~(days / 30)} mesos`;

    return `${~~days} dies`;
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
                  Membre des de fa {generateMemberTime(user.created_at)}
                </p>
              )}
            </div>
            {isUser && event?.accepted && user && (
              <button
                type="button"
                className="hacker-profile-ticket"
                onClick={handleShowQR}
              >
                <span>Mostra el teu tiquet</span>
                <img src={qrIcon} alt="" width="48" height="48" />
              </button>
            )}
          </header>

          {isUser ? (
            <div className="profile-workspace">
              <nav className="profile-navigation" aria-label="Àrea personal">
                <NavLink end to="/perfil">Resum</NavLink>
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
                    <div className="hacker-profile-actions"><EditProfile hackerObj={user} /></div>
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
                  <>
                    <h2>Resum</h2>
                    <p className="profile-description">El més important per preparar la teva participació.</p>
                    {isHacker ? <>
                      <div className="profile-summary-card">
                        <h3>HackEPS 2026</h3>
                        <p>{event?.accepted ? (event.confirmed ? "Inscripció acceptada i confirmada." : "Inscripció acceptada. Tens una confirmació pendent.") : event?.registered ? "La teva inscripció està pendent d’acceptació." : "Encara no t’has inscrit a aquesta edició."}</p>
                        <Link className="profile-primary-link" to="/perfil/esdeveniments">{event?.registered ? "Veure la inscripció" : "Veure l’esdeveniment"}</Link>
                      </div>
                      {event?.registered && <div className="profile-summary-card">
                        <h3>{team?.name || "Encara no tens equip"}</h3>
                        <p>{team ? "Consulta els membres i gestiona el teu equip." : "Crea el teu equip o uneix-te a un amb un codi."}</p>
                        <Link className="profile-primary-link" to="/perfil/equip">El meu equip</Link>
                      </div>}
                    </> : <div className="profile-summary-card"><p>Gestiona les teves dades des del teu perfil.</p><Link className="profile-primary-link" to="/perfil/dades">El meu perfil</Link></div>}
                  </>
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
        <QrCode url={qrCode} />
      </Modal>
    </>
  );
};

export default ProfileComponent;
