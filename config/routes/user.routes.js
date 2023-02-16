const _ = require("lodash");
const routeUtils = require("./utils.route.js");
const User = require("../../models/user.js");

module.exports = [
  // Read self
  {
    method: "GET",
    path: "/users/self",
    config: {
      description: "Read a user",
      tags: ["Users"],
    },
    handler: async (request, h) => {
      try {
        const { user } = request.auth.credentials;
        const res = await user.findComplete();
        return routeUtils.replyWith.found(res, h);
      } catch (err) {
        return routeUtils.handleErr(err, h);
      }
    },
  },
  {
    method: "GET",
    path: "/users/{userId}",
    config: {
      description: "Read a user by id",
      tags: ["Users"],
    },
    handler: async (request, h) => {
      try {
        const { user } = request.auth.credentials;
        const authUser = await user.findComplete();
        const isAdmin = routeUtils.hasRole(authUser, "admin");
        if (!isAdmin) {
          return routeUtils.replyWith.unauthorized("Unauthorized", h);
        }
        
        const foundUser = await User.findByPk(request.params.userId);
        if (!foundUser) {
          return routeUtils.replyWith.notFound("User not found", h);
        }
        const userInfo = await foundUser.findComplete();

        return routeUtils.replyWith.found(userInfo, h);
      } catch (err) {
        return routeUtils.handleErr(err, h);
      }
    },
  },
];
