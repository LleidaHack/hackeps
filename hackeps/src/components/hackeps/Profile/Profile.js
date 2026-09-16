import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

          {user && (
            <div className="hacker-profile-accounts">
              <LinkAccounts hacker={user} />
            </div>
          )}
          {isUser && (
            <div className="hacker-profile-actions">
              {user && <EditProfile hackerObj={user} />}
              <Link to="/" className="hacker-profile-logout" onClick={logOut}>
                Tancar sessió
              </Link>
            </div>
          )}
          {isHacker && (
            <div className="hacker-profile-event">
              <Join event={event} />
            </div>
          )}
          {event?.registered && isHacker && (
            <section className="hacker-profile-team" aria-label="El teu equip">
              <Team team={team} is_user={isUser} />
            </section>
          )}
          {isHacker && <ProfileHighlights event={event} />}
        </div>
      </main>

      <Modal show={showQR} onHide={handleCloseQR} centered>
        <QrCode url={qrCode} />
      </Modal>
    </>
  );
};

export default ProfileComponent;
