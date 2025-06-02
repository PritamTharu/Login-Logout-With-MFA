export const environment = {


  register: 'http://localhost:3000/api/register',
  login: 'http://localhost:3000/api/login',
  deleteAccount: 'http://localhost:3000/api/deleteAccount',
  getProfile: 'http://localhost:3000/api/getProfile',
  getAllUsers: 'http://localhost:3000/api/getAllUsers',
  sessionURL: 'http://localhost:3000/api/verifySession',
  logout: 'http://localhost:3000/api/logout',
  refreshToken: 'http://localhost:3000/api/refresh-token',
  updateProfile: 'http://localhost:3000/api/updateProfile',
  isAdmin: 'http://localhost:3000/api/isAdmin',
  mapbox: {
    accessToken: 'pk.eyJ1IjoiYnJhc2thbSIsImEiOiJja3NqcXBzbWoyZ3ZvMm5ybzA4N2dzaDR6In0.RUAYJFnNgOnn80wXkrV9ZA',
  },
  generateTOTP: 'http://localhost:3000/api/mfa/generateTOTP',
  verifyTOTP: 'http://localhost:3000/api/mfa/verifyTOTP',
  removeTOTP: 'http://localhost:3000/api/mfa/removeTOTP'
};
