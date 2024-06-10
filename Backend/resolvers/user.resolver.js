import { response } from "express";
import { users } from "../dummyData/dummyData.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const userResolver = {
  Query: {
    authUser: async (_, _, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (error) {
        console.log("error in authUser", error);
        throw new Error("Internal server error: " || error.message);
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (error) {
        console.log("error in user query", error);
        throw new Error("Error in getting user: " || error.message);
      }
    },
  },
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;
        if (!username || !name || !password || !gender) {
          throw new Error("All fields must be provided");
        }
        const existingUser = await User.findOne({ username });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = await User.create({
          username,
          password: hashedPassword,
          gender,
          name,
          profilePicture: gender === "male" ? boyProfilePic : GirlProfilePic,
        });

        await context.login(newUser);
        return newUser;
      } catch (error) {
        console.log("error in signup", error);
        throw new Error("Internal server error: " || error.message);
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        const { user } = await context.authenticate("graphql-local", {
          email,
          password,
        });

        await context.login(user);
        return user;
      } catch (error) {
        console.log("error in login", error);
        throw new Error("Internal server error: " || error.message);
      }
    },
    logout: async (_, _, context) => {
      try {
        await context.logout();
        req.session.destroy((err) => {
          if (err) throw err;
        });
        res.clearCookie("connect.sid");
        return { message: "Logout successfully" };
      } catch (error) {
        console.log("error in logout", error);
        throw new Error("Internal server error: " || error.message);
      }
    },
  },
  //Todo=> Add User/transaction relationship
};

export default userResolver;
