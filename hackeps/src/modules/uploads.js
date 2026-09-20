export const MAX_UPLOAD_BYTES = 1024 * 1024;
const imageTypes = {
  "image/png": /\.png$/i,
  "image/jpeg": /\.jpe?g$/i,
  "image/webp": /\.webp$/i,
};
function read(file, method) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("No hem pogut llegir el fitxer."));
    reader[method](file);
  });
}
export async function readUpload(file, kind) {
  const valid =
    kind === "cv"
      ? file.type === "application/pdf" && /\.pdf$/i.test(file.name)
      : imageTypes[file.type]?.test(file.name);
  if (!valid)
    throw new Error(
      kind === "cv"
        ? "Selecciona un fitxer PDF."
        : "Selecciona una imatge JPG, PNG o WebP.",
    );
  if (!file.size || file.size > MAX_UPLOAD_BYTES)
    throw new Error("El fitxer ha de tenir contingut i no pot superar 1 MB.");
  const bytes = new Uint8Array(
    await read(file.slice(0, 12), "readAsArrayBuffer"),
  );
  const matches = (values, offset = 0) =>
    values.every((value, index) => bytes[offset + index] === value);
  const signatures = {
    "image/png": matches([137, 80, 78, 71, 13, 10, 26, 10]),
    "image/jpeg": matches([255, 216, 255]),
    "image/webp": matches([82, 73, 70, 70]) && matches([87, 69, 66, 80], 8),
    "application/pdf": matches([37, 80, 68, 70, 45]),
  };
  if (!signatures[file.type])
    throw new Error("El contingut del fitxer no correspon al format indicat.");
  return read(file, "readAsDataURL");
}
