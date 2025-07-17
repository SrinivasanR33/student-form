// utils/otpStore.ts
const otpMap = new Map<string, string>();
const verifiedSet = new Set<string>();

export function saveOtp(phone: string, otp: string) {
  otpMap.set(phone, otp);
}
export function getOtp(phone: string) {
    console.log(otpMap)
  return otpMap.get(phone);
}
export function clearOtp(phone: string) {
  otpMap.delete(phone);
}
export function markVerified(phone: string) {
  verifiedSet.add(phone);
}
export function isVerified(phone: string) {
  return verifiedSet.has(phone);
}
export function clearVerified(phone: string) {
  verifiedSet.delete(phone);
}
