/**
 * A function which returns user's IP address.
 * @param {object} request Express request object
 * @return {string} User's IP address
 */
export default function(request) {
  //attempt to extract IP from 'x-forwared-for' headers]
  let ipAddress;
  let ipAddressFromHeaders = request.headers["x-forwarded-for"];
  //a safety check for array
  if (ipAddressFromHeaders && Array.isArray(ipAddressFromHeaders)) {
   ipAddress = ipAddressFromHeaders.split(",").pop();
  }
  //fall back on other request properties
  else {
    ipAddress = request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
  }
  console.log(ipAddress);
  return ipAddress;
};