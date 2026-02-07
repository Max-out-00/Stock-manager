// Date formatting utility functions

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString();
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString();
};
