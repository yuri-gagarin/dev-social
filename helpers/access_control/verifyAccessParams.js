export default function(params) {
  //console.log(params)
  //console.log(typeof params)

  if (typeof params !== "object") {
    throw new TypeError("Expected an object");
  }
  let argParams = Object.keys(params);
  if (argParams[0] === undefined || argParams[1] === undefined) {
    throw new Error(`Invalid paramaters passed`);
  }
  if(params[argParams[0]] === undefined) {
    throw new Error(`User id is undefined`);
  }
  if(params[argParams[1]] === undefined) {
    throw new Error(`Model id is undefined`);
  }
};
