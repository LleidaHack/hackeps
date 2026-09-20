import React, { useEffect } from "react";
import DarkPage from "src/components/hackeps/Layout/DarkPage.js";
import ConfirmAssistance from "src/components/hackeps/ConfirmAssistance/ConfirmAssistance";
import { useLocation, useNavigate } from "react-router-dom";

const ConfirmAssistancePage = (props) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const confirm = state?.confirm || params.get("confirm");
  const token = state?.token || params.get("token");

  useEffect(() => {
    if (!confirm || !token) {
      navigate("/");
    }
  }, [confirm, token, navigate]);

  if (!confirm || !token) {
    return null;
  }

  return (
    <DarkPage>
      <ConfirmAssistance confirm={confirm} token={token} />
    </DarkPage>
  );
};

export default ConfirmAssistancePage;
