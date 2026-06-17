/**
 * Global Application ID System
 * Format: [COUNTRY_SHORT_CODE]-[COUNTRY_CALLING_CODE][SERIAL] = 12 digits total
 * Example: QAT-974000000001
 */

export const COUNTRY_MAP = {
  PAK: "92",  UAE: "971", IND: "91",  TUR: "90",  QAT: "974",
  SAU: "966", BGD: "880", NPL: "977", OMN: "968", KWT: "965",
  BHR: "973", AFG: "93",  GBR: "44",  USA: "1",   CAN: "1",
  AUS: "61",  MYS: "60",  IDN: "62",
};

// Detect country from phone prefix
export function detectCountryFromPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  const sorted = Object.entries(COUNTRY_MAP).sort((a, b) => b[1].length - a[1].length);
  for (const [code, calling] of sorted) {
    if (digits.startsWith(calling)) return code;
  }
  return "QAT";
}

// Pad serial so total numeric part = 12 digits (calling code + zero-padded serial)
function buildSerial(callingCode, serialNum) {
  const serialStr = String(serialNum).padStart(12 - callingCode.length, "0");
  return callingCode + serialStr;
}

// Generate a new unique Application ID
export function generateApplicationId(countryCode, existingIds = []) {
  const calling = COUNTRY_MAP[countryCode] || "974";
  const prefix = `${countryCode}-`;

  let maxSerial = 0;
  for (const id of existingIds) {
    if (id.startsWith(prefix)) {
      const numPart = id.slice(prefix.length + calling.length);
      const serial = parseInt(numPart, 10);
      if (!isNaN(serial) && serial > maxSerial) maxSerial = serial;
    }
  }

  const nextSerial = maxSerial + 1;
  return `${countryCode}-${buildSerial(calling, nextSerial)}`;
}

// Validate ID format (12 numeric digits after dash)
export function isValidApplicationId(id) {
  return /^[A-Z]{2,3}-\d{12}$/.test(id);
}