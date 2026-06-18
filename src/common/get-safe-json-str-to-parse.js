export const getSafeJsonStrToParse = (strValue) => strValue.replace(/,(\s*[\]}])/g, "$1");
