import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "src/components/hackeps/QrCode/QrCode.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useEffect } from "react";
import TitleGeneralized from "../TitleGeneralized/TitleGeneralized";

const QrCode = (props) => {
  const [url, setUrl] = useState(props.url);
  const ticket = props.ticket;

  useEffect(() => {
    setUrl(props.url);
  }, [props.url]);

  const qrcode = (
    <QRCodeCanvas id="qrCode" value={url || ""} size={200} level={"H"} />
  );
  return (
    <Container>
      <Row>
        <Col id="bg-white" className={"mx-auto m-3 text-center"}>
          <TitleGeneralized marginBot="2">El teu tiquet</TitleGeneralized>
          {ticket?.eventName && (
            <p className="qrcode__event">{ticket.eventName}</p>
          )}
          <p>
            {ticket?.checkedIn
              ? "Ja has fet el check-in. Durant l’esdeveniment ensenya la teva acreditació."
              : "Ensenya aquest QR al check-in i et donarem la teva acreditació."}
          </p>
          <div className="qrcode__container" style={{ margin: 30 }}>
            <div style={{ margin: "auto" }}>{qrcode}</div>
          </div>
          {url && <p className="qrcode__code">{url}</p>}
          {ticket?.checkedIn && ticket.voucherCode && (
            <p className="qrcode__voucher">Acreditació {ticket.voucherCode}</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default QrCode;
