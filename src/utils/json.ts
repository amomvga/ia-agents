export const extractJsonObject = (value: string) => {
  const start = value.indexOf('{');
  const end = value.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Nenhum objeto JSON válido encontrado na resposta');
  }

  return JSON.parse(value.slice(start, end + 1));
};
