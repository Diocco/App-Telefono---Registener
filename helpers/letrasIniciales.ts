export const nombreIniciales = (nombre: string | undefined) => {
  if (!nombre) return "";
  const iniciales = nombre?.split(" ");
  if (iniciales.length > 1)
    return `${iniciales[0][0].toUpperCase()}${iniciales[1][0].toUpperCase()}`;
  else return `${nombre[0].toUpperCase()}${nombre[1].toUpperCase()}`;
};
