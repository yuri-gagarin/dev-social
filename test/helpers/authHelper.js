import app from "../../"
async function loginUser(options) {
  if(typeof options !== "object") {
    throw new TypeError(`Expected first argument to be a type {'object'} instead saw '${typeof options}' `);
  }
}
