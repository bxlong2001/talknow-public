/* eslint-disable eslint-comments/no-unused-disable */
/* eslint-disable prettier/prettier */
const phoneNumberRegex = /^(03[2-9]|05[6-8]|07[0-9]|08[1-9]|09[0-9])[0-9]{7}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validatePhone = (phone: string) => {
  return phoneNumberRegex.test(phone);
};

export const validatePassword = (password: string) => {
  return passwordRegex.test(password);
};

export const formatTime = (seconds: number) => {
  // eslint-disable-next-line prettier/prettier
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
};
export const getInitials = (fullName: string) => {
  const names = fullName?.split(' ');

  if (names?.length === 1) {
    // Nếu chỉ có một từ (chỉ có họ hoặc tên), lấy 2 ký tự đầu
    return names[0]?.slice(0, 2).toUpperCase();
  } else {
    // Nếu có họ và tên, lấy chữ cái đầu của họ và tên
    const firstNameInitial = names[0][0]?.toUpperCase();
    const lastNameInitial = names[names?.length - 1][0].toUpperCase();
    return `${firstNameInitial}${lastNameInitial}`;
  }
};
