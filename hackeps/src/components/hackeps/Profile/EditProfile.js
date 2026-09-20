import React, { useEffect, useState } from "react";
import { updateHacker } from "src/services/HackerService";
import { readUpload } from "src/modules/uploads";
import defaultAvatar from "src/assets/img/home10/marraco-mentor-raw.webp";

const EditProfile = ({ hackerObj, onSaved }) => {
  const [values, setValues] = useState({});
  const [image, setImage] = useState("");
  const [imageChanged, setImageChanged] = useState(false);
  const [cv, setCv] = useState(null);
  const [cvName, setCvName] = useState("");
  const [sending, setSending] = useState(false);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setValues({ shirt_size: hackerObj.shirt_size || "", linkedin: hackerObj.linkedin || "", github: hackerObj.github || "" });
    setImage(hackerObj.image || "");
    setImageChanged(false);
    setCv(null);
    setCvName("");
  }, [hackerObj]);

  const change = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    setSaved(false);
  };

  const upload = async (event, kind) => {
    const input = event.target;
    const file = input.files[0];
    if (!file) return;
    setError(""); setSaved(false); setReading(true);
    try {
      const value = await readUpload(file, kind);
      if (kind === "cv") { setCv(value); setCvName(file.name); }
      else { setImage(value); setImageChanged(true); }
    } catch (error) { setError(error.message); input.value = ""; }
    finally { setReading(false); }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (sending || reading) return;
    setSending(true);
    setError("");
    setSaved(false);
    const data = { id: hackerObj.id || localStorage.getItem("userID"), ...values };
    if (!data.shirt_size) delete data.shirt_size;
    if (imageChanged) data.image = image;
    if (cv !== null) data.cv = cv;
    try {
      const result = await updateHacker(data);
      if (!result?.success) { setError(result?.errMssg || "No hem pogut desar els canvis. Torna-ho a provar."); return; }
      onSaved?.({ ...hackerObj, ...data });
      setSaved(true);
    } catch {
      setError("No hem pogut desar els canvis. Torna-ho a provar.");
    } finally { setSending(false); }
  };

  return (
    <form className="profile-editor" onSubmit={submit}>
      <fieldset disabled={sending || reading}>
        <legend>Foto de perfil</legend>
        <div className="profile-editor-photo">
          <img src={image || defaultAvatar} alt="Previsualització de la foto de perfil" />
          <label>Canvia la foto
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => upload(event, "image")} />
            <small>JPG, PNG o WebP. Màxim 1 MB.</small>
          </label>
        </div>
      </fieldset>
      <fieldset disabled={sending || reading}>
        <legend>Dades i enllaços</legend>
        <div className="profile-editor-grid">
          <label>LinkedIn
            <input type="url" name="linkedin" placeholder="https://www.linkedin.com/in/…" value={values.linkedin || ""} onChange={change} />
          </label>
          <label>GitHub
            <input type="url" name="github" placeholder="https://github.com/…" value={values.github || ""} onChange={change} />
          </label>
        </div>
        <label>Talla de samarreta
          <select name="shirt_size" value={values.shirt_size || ""} onChange={change}>
            <option value="">Selecciona una talla</option>
            {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => <option key={size}>{size}</option>)}
          </select>
        </label>
      </fieldset>
      <fieldset disabled={sending || reading}>
        <legend>Currículum <small>Opcional</small></legend>
        <label>Adjunta el teu CV
          <input type="file" accept="application/pdf" onChange={(event) => upload(event, "cv")} />
          <small>Format PDF. Màxim 1 MB.</small>
        </label>
        {cvName && <div className="profile-editor-file">
          <p>{cvName}</p>
          <button type="button" onClick={(event) => {
            event.currentTarget.closest("fieldset").querySelector('input[type="file"]').value = "";
            setCv(""); setCvName(""); setSaved(false);
          }}>Treu el fitxer</button>
        </div>}
      </fieldset>
      <div className="profile-editor-save">
        {error && <p role="alert" className="profile-editor-error">{error}</p>}
        {saved && <p role="status" className="profile-editor-success">Els canvis s’han desat correctament.</p>}
        <button type="submit" disabled={sending || reading}>{sending ? "Desant…" : reading ? "Carregant fitxer…" : "Desa els canvis"}</button>
      </div>
    </form>
  );
};

export default EditProfile;
