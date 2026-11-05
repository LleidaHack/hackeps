import { fetchPlus } from "src/modules/fetchModule";
const messages = {
  "Nice try, farmer. This tractor does not mint LleidaCoins.":
    "Bon intent, pagès: aquest tractor no fabrica LleidaCoins. 🚜",
  "Already registered in this round":
    "Ja has recollit aquest àpat o participat en aquesta activitat en aquesta ronda.",
  "Meal already collected in this round":
    "Ja has recollit aquest àpat en aquesta ronda.",
  "Meal round is closed": "Aquesta ronda està tancada.",
  "Meal round changed; refresh before scanning again":
    "La ronda ha canviat. Actualitza abans de tornar a escanejar.",
  "Insufficient LleidaCoins": "No tens prou LleidaCoins per a aquest premi.",
  "Prize out of stock": "Aquest premi està esgotat.",
  "Participant must check in first":
    "Cal registrar primer l’entrada del participant.",
  "Organizer permission required": "Necessites permisos d’organització.",
  "Participant code not found":
    "No s’ha trobat cap participant amb aquest codi.",
  "Badge is unassigned or belongs to another event":
    "L’acreditació no està assignada o pertany a un altre esdeveniment.",
  "Configuration changed; refresh before saving":
    "La configuració ha canviat. Actualitza abans de desar.",
  "Not enough time; extend judging hours or reduce slot length":
    "No hi caben totes les presentacions. Amplia l’horari o redueix-ne la durada.",
  "Presentation changed; refresh first":
    "El torn ha canviat. Actualitza abans d’editar-lo.",
  "Schedule conflict; adjust time or explicitly override":
    "Hi ha un solapament. Canvia l’hora o autoritza una excepció.",
  "Room or team already has an active presentation":
    "La sala o l’equip ja té una presentació activa.",
  "Web Push is not configured":
    "Les notificacions push encara no estan configurades.",
  "Movement already reversed": "Aquest moviment ja s’ha corregit.",
  "Operation identifier already used for a different request":
    "Aquest identificador ja correspon a una altra operació.",
  "Active meal delivery not found":
    "No s’ha trobat l’entrega o ja està corregida.",
};
export async function operationRequest(
  path,
  method = "GET",
  body,
  authenticated = true,
) {
  const result = await fetchPlus({
    Url: path,
    Method: method,
    Body: body,
    hasUserauth: authenticated,
  });
  if (result?.errCode != null) {
    const error = new Error(messages[result.errMssg] || result.errMssg);
    error.code = result.errCode;
    throw error;
  }
  return result;
}
