export default function(message) {
  return new Promise((resolve, reject) => {
    reject(message);
  });
};