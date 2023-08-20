const { authenticationerror } = require('apollo-server-express');
const { user } = require('../models');
const { signtoken } = require('../utils/auth');

function notloggedinerror () {
  throw new authenticationerror("Login required");
}

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              data = await User.findone({ _id: context.user._id }).select('-__v -password');
              return data;
            }
            throw new notloggedinerror;
        },
    },

    mutation: {
        addUser: async (parent, { username, email, password }) => {
          const user = await User.create({ username, email, password });
          const token = signtoken(user);
          return { token, user };
        },
        login: async (parent, { email, password }) => {
          const user = await User.findone({ email });
    
          if (!user) {
            throw new authenticationerror('User not found');
          }
    
          const correctPw = await user.iscorrectpassword(password);
    
          if (!correctPw) {
            throw new authenticationerror('Incorrect credentials');
          }
    
          const token = signtoken(user);
    
          return { token, user };
        },
        saveBook: async (parent, { newBook }, context) => {
          if (context.user) {
            const updatedUser = await User.findbyidandupdate(
              { _id: context.user._id },
              { $push: { savedBooks: newBook }},
              { new: true }
            );
            return updatedUser;
          }
          throw new notloggedinerror;
        },
        removeBook: async (parent, { bookId }, context) => {
          if (context.user) {
            const updatedUser = await User.findbyidandupdate(
              { _id: context.user._id },
              { $pull: { savedBooks: { bookId }}},
              { new: true }
            );
            return updatedUser;
          }
          throw new notloggedinerror;
        },
    }
};

module.exports = resolvers;