import React, { useEffect } from "react";
import "src/components/hackeps/Team/Team.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "src/components/buttons/Button";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  addHackerGroup,
  addHackerToGroupByCode,
  getHackerGroupById,
  removeHackerFromGroup,
  setHackerGroupLeader,
} from "src/services/HackerGroupService";
import { getHackeps } from "src/services/EventService";
import ProfilePic from "src/components/hackeps/ProfilePic/ProfilePic";
import TitleGeneralized from "../TitleGeneralized/TitleGeneralized";
import Modal from "react-bootstrap/Modal";
import "src/components/hackeps/Forms/PublicFormLayout.css";

const TeamDialog = ({ isOpen, onClose, children, titleId }) => (
  <Modal show={isOpen} onHide={onClose} centered className="team-dialog" aria-labelledby={titleId}>
    <Modal.Header>
      <button type="button" className="team-dialog-close" onClick={onClose} aria-label="Tanca">×</button>
    </Modal.Header>
    <Modal.Body>{children}</Modal.Body>
  </Modal>
);

const Team = (props) => {
  const [team, setTeam] = useState(props.team);
  const updateTeam = (nextTeam) => {
    setTeam(nextTeam);
    props.onTeamChange?.(nextTeam);
  };
  const is_user = props.is_user;
  const currentUserId = localStorage.getItem("userID");
  const isCurrentUser = (id) => id != null && currentUserId != null && String(id) === String(currentUserId);
  const canManageMember = (member) => Boolean(
    is_user && team && member?.id != null && isCurrentUser(team.leader_id) &&
    !isCurrentUser(member.id) && String(member.id) !== String(team.leader_id)
  );

  useEffect(() => {
    setTeam(props.team);
  }, [props.team]);

  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const handleShowCreateTeam = () => setShowCreateTeam(true);
  const handleCloseCreateTeam = () => setShowCreateTeam(false);

  const {
    register: registerJoinTeam,
    handleSubmit: handleSubmitJoinTeam,
    formState: { errors: errorsJoinTeam },
  } = useForm({
    mode: "onChange",
  });

  const {
    register: registerCreateTeam,
    handleSubmit: handleSubmitCreateTeam,
    formState: { errors: errorsCreateTeam },
  } = useForm({
    mode: "onChange",
  });

  const [showJoinTeam, setShowJoinTeam] = useState(false);
  const handleShowJoinTeam = () => setShowJoinTeam(true);
  const handleCloseJoinTeam = () => setShowJoinTeam(false);
  const [err, setErr] = useState("");
  const [JoinErrorMessage, setJoinErrorMessage] = useState("");
  async function handleKick(member) {
    if (!canManageMember(member)) return;
    await removeHackerFromGroup(member.id, team.id);
    updateTeam(await getHackerGroupById(team.id));
  }

  async function handleMakeLeader(member) {
    if (!canManageMember(member)) return;
    await setHackerGroupLeader(team.id, member.id);
    updateTeam(await getHackerGroupById(team.id));
  }

  async function handleLeave() {
    let a = await removeHackerFromGroup(
      localStorage.getItem("userID"),
      team.id,
    );
    if (a.errCode) {
      setErr(a.errMssg);
    } else {
      updateTeam(null);
    }
  }

  async function joinTeam(val) {
    let a = await addHackerToGroupByCode(
      val.teamCode ? val.teamCode.replace(/[# ]/g, "") : "",
      localStorage.getItem("userID"),
    );
    if (a.success) {
      updateTeam(await getHackerGroupById(a.added_group_id));
      setShowJoinTeam(false);
    } else {
      setJoinErrorMessage(a.errMssg);
    }
  }

  async function createTeam(val) {
    const edition = await getHackeps();
    if (!edition?.id) return;
    const team = {
      name: val.teamName,
      description: val.teamDesc,
      leader_id: localStorage.getItem("userID"),
      event_id: edition.id,
    };
    let a = await addHackerGroup(team);
    if (a.success) {
      updateTeam(await getHackerGroupById(a.group_id));
      setShowCreateTeam(false);
    }
  }

  function TeamButtons() {
    const handleSubmitJoinTeam2 = (data) => {
      joinTeam(data);
    };

    const handleSubmitCreateTeam2 = (data) => {
      createTeam(data);
    };

    return (
      <>
        {is_user && (
          <div className="team-empty-actions">
            <Button orange onClick={handleShowJoinTeam}>Unir-me a un equip</Button>
            <Button className="team-create-action" onClick={handleShowCreateTeam}>Crear un equip</Button>
          </div>
        )}

        <TeamDialog
          titleId="join-team-title"
          isOpen={showJoinTeam}
          onClose={handleCloseJoinTeam}
          children={
            <div className="team-form-container">
              <h2 id="join-team-title">Unir-me a un equip</h2>
              <p>Introdueix el codi que t’ha compartit el teu equip.</p>
              <form
                className="public-form flex flex-col gap-3"
                onSubmit={handleSubmitJoinTeam((data) =>
                  handleSubmitJoinTeam2(data),
                )}
              >
                <label className="team-field-label">
                  Codi de l'equip (#XXXXXXXXXX):
                  <input
                    className={`${errorsJoinTeam.teamCode ? "bg-pink-100" : "bg-white"} min-h-10 px-2 text-base mt-2`}
                    placeholder="#1234567890"
                    {...registerJoinTeam("teamCode", {
                      required: "El codi de l'equip és obligatori",
                    })}
                  />
                  {errorsJoinTeam.teamCode && (
                    <span className="text-red-400">
                      {errorsJoinTeam.teamCode.message}
                    </span>
                  )}
                </label>

                <Button orange type="submit">
                  Unir-me a l'equip
                </Button>
                <p className="text-red-400">{JoinErrorMessage}</p>
              </form>
            </div>
          }
        />

        <TeamDialog
          titleId="create-team-title"
          isOpen={showCreateTeam}
          onClose={handleCloseCreateTeam}
          children={
            <div className="team-form-container">
              <form
                className="public-form flex flex-col gap-3"
                onSubmit={handleSubmitCreateTeam((data) =>
                  handleSubmitCreateTeam2(data),
                )}
              >
                <h2 id="create-team-title">Crear un equip</h2>
                <label className="team-field-label">
                  Nom de l'equip:
                  <input
                    className={`${errorsCreateTeam.teamName ? "bg-pink-100" : "bg-white"} min-h-10 px-2 text-base mt-2`}
                    placeholder=""
                    {...registerCreateTeam("teamName", {
                      required: "El nom de l'equip és obligatori",
                    })}
                  />
                  {errorsCreateTeam.teamName && (
                    <span className="text-red-400">
                      {errorsCreateTeam.teamName.message}
                    </span>
                  )}
                </label>

                <label className="team-field-label">
                  Descripció:
                  <input
                    className={`${errorsCreateTeam.teamDesc ? "bg-pink-100" : "bg-white"} min-h-10 px-2 text-base mt-2`}
                    placeholder=""
                    {...registerCreateTeam("teamDesc", {
                      required: "La descripció de l'equip és obligatori",
                    })}
                  />
                  {errorsCreateTeam.teamDesc && (
                    <span className="text-red-400">
                      {errorsCreateTeam.teamDesc.message}
                    </span>
                  )}
                </label>

                <Button orange type="submit">
                  Crear equip
                </Button>
              </form>
            </div>
          }
        />
      </>
    );
  }

  function TeamInfo() {
    return (
      <div className="Alineador">
        <div className="bg-transparent text-center mt-5 m-0 p-3 containerinf">
          <TitleGeneralized padTop="0" primary>
            {team.name} {team.code && `Codi: #${team.code}`}
          </TitleGeneralized>
          <Container className="">
            <Row className="justify-content-center">
              {team.members.map((member, index) => (
                <Col className="col-xxl-3 cards" key={index}>
                  <div className="p-3 text-center bg-transparent smallCard">
                    <ProfilePic hacker={member} size="big" bgcolor="black" />
                    <p className="team-member-name">{member.name}</p>
                    {isCurrentUser(member.id) ? (
                      ""
                    ) : (
                      <>


                        {canManageMember(member) ? (
                          <>
                            <Button
                              primary
                              sm
                              onClick={() => handleKick(member)}
                              className="my-2 min-w-full"
                            >
                              Expulsar
                            </Button>

                            <Button
                              className="my-2 min-w-full"
                              sm
                              primary
                              onClick={() => handleMakeLeader(member)}
                            >
                              Fer líder
                            </Button>
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
          {is_user && (
            <>
              <Button primary onClick={() => handleLeave()}>
                Sortir del grup
              </Button>
              <p style={{ color: "#c00" }}>{err}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return <>{team ? <TeamInfo /> : TeamButtons()}</>;
};
export default Team;
