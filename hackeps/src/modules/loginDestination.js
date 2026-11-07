export function isScannerVolunteer(account) {
  return (
    account?.access_role === "lleidahacker" ||
    (!account?.access_role &&
      ["lleidahacker", "lleida_hacker"].includes(account?.type))
  );
}

export function loginDestination(account, nextScreen) {
  if (isScannerVolunteer(account)) return "/organitzacio";
  if (nextScreen) return nextScreen;
  return ["admin", "superadmin"].includes(account?.access_role)
    ? "/organitzacio"
    : "/perfil";
}
