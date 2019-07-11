export default function(request) {
  //attempt to extract IP from 'x-forwared-for' headers
  let ipAddress = request.headers["x-forwarded-for"].split(",").pop();
  if(ipAddress) {
    
    return ipAddress;
  }
  //fall back on other request properties
  else {
    ipAddress = request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;

    return ipAddress;
  }
};