const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../../models/User');
const {validateRegisterInput} = require('../../util/validators')
const { UserInputError } = require('apollo-server');
const {SECRET_KEY} = require('../../config')
module.exports = {
    Mutation: {
        async register(
            _,
            {
                registerInput: {username, email, password, confirmPassword}
            },
            context,
            info) {
            //Validate user data
            const { valid, errors} = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword
            );
            if(!valid){
                throw new UserInputError('Errors', {errors})
            }
            //Verify user already exist
            const user = await User.findOne({username});
            if(user){
                throw new UserInputError('Username is taken',{
                    errors: {
                        username: 'This name is taken'
                    }
                })
            }
            //Encript data and create new user in mongo database
            password = await bcrypt.hash(password, 12)

            const newUser = new User(
                {
                    email,
                    username,
                    password,
                    createdAt: new Date().toISOString()
                }
            )

            const res = await newUser.save();
            const token = jwt.sign(
                {
                    id: res.id,
                    email: res.email,
                    username: res.username
                },
                SECRET_KEY, {expiresIn: '1h'});

            return {...res._doc, id: res._id, token}
        }
    }
}
