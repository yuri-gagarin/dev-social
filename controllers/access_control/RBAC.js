export default class RBAC {
  constructor(options) {
    //check for correct input
    //if (typeof options !== "object") {
    //  throw new TypeError("Expected an object type as input");
    //}
    this.init(options);
    this.roles;
    console.log(this.roles)
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

  can(role, operation, params={}) {
    //check for a valid role
    if (!this.roles[role]) {
      return false;
    }
    //set role to a variable, check if operation is allowed
    let $role = this.roles[role];
    if ($role.can[operation]) {
      if (typeof $role.can[operation] !== "function") {
        return true;
      }
      console.log(51)
      
      if ($role.can[operation](params)) {
        return true;
      }
    }
    //check for parent roles
    if (!$role.inherits || $role.inherits.length < 1) {
      return false;
    }
    //checks for a passed role and if the roles operation exists
    return $role.inherits.some((childRole) => {
      return this.can(childRole, operation, params);
    });
  }
};
