export default class RBAC {
  constructor(options) {

    this.init(options);
    this.roles;
    this.iterations = 0;

  }

  init(roles) {
    if (typeof roles !== "object") {
      throw new TypeError("Expected an object type as input");
    }
    let map = {};
    Object.keys(roles).forEach((role) => {
      map[role] = {
        can: {}
      };
      //check for inherited roles
      if (roles[role].inherits) {
        map[role].inherits = roles[role].inherits;
      }

      roles[role].can.forEach((operation) => {
        //if role is available assign truthy value
        if (typeof operation === "string") {
          map[role].can[operation] = 1;
        }
        //if a function assign a function
        else if (typeof operation.name === "string" && typeof operation.when === "function") {
          map[role].can[operation.name] = operation.when
        }
      })
    });
    this.roles = map;
  }

  can(role, operation, params={}, cb) {
    let callback = cb || function(){};
    //check for a valid role
    this.iterations +=1;
    return new Promise((resolvePromise, rejectPromise) => {


      function resolve(result) {
        resolvePromise(result);
        callback(undefined, result);
      }
      function reject(err) {
        rejectPromise(err);
        callback(err);
      }

      if (typeof role !== "string") {
        throw new TypeError("Expected the first paramater to be a String : role");
      }
      if (typeof operation !== "string") {
        throw new TypeError("Expected the second parameter to be a String: operation");
      }
      //set role to a variable, check if operation is allowed
      let $role = this.roles[role];

      if ($role.can[operation] === 1) {
        return resolve({permitted: true});
      }

      if (!$role) {
        return reject(new Error("Cannot find a user role"));
      }
      if (!$role.can[operation]) {
        if (!$role.inherits) {
          return resolve({permitted: false});
        }
        return Promise.race(
          $role.inherits.map((child) => {
            return this.can(child, operation, params)
          })
        ).then(resolve, reject);
      }
      
    

      if(typeof $role.can[operation] === "function") {
        $role.can[operation](params, function(err, result) {
          if (err) {
            return reject(err);
          }
          if (!result || result === undefined) {
           // console.log(typeof reject("cannot edit"))
            return resolve({permitted: false})
          }
          if (result) {
            return resolve({permitted: true});
          }
        });
      }
      return reject("Not allowed");
    })
    .catch((err) => {
      console.log("An error occured")
      console.log(err)
      return;
    });
  }
}
