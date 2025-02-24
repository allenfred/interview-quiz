export const formatDateTimeLocal = (dateString: string) => {
  const date = new Date(dateString);
  const pad = (num: number) => (num < 10 ? '0' + num : num);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const validateEmail = (email: string): Boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): Boolean => {
  const re = /^\d{11}$/;
  return re.test(phone);
};

export const validatePassword = (password: string): Boolean => {
  return password.length >= 6;
};

export const validateContactInfo = (contactInfo: string): Boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{11}$/;
  return emailRegex.test(contactInfo) || phoneRegex.test(contactInfo);
};
