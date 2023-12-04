import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials"
import { authConfig } from './authConfig';
import { connectToDB } from "./lib/utils";
import { User } from "./lib/models";
import CryptoJS from 'crypto-js';

// const login = async (credentials) => {
//     try {
//         connectToDB()
//         const user = await User.findOne({username: credentials.username})

//         if(!user) throw new Error("Wrong username credentials!")

//         const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SEC);

//         const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
    
//         if(originalPassword !== credentials.password) throw new Error("Email or password incorrect!")
    
//         // return {...user._doc, _id: user._id.toString()}

//         return user
    

//     } catch (error) {
//         console.log(error)
//         throw new Error("Failed to login!")
//     }
// }

async function signInWithCredentials({username, password}){
    try {
            connectToDB()

            console.log(username)

            const user = await User.findOne({username})

            if(!user) throw new Error("Username does not exist!")

            const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SEC);

            const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)

            if(originalPassword !== password) throw new Error("Email or password incorrect!")

            return {...user._doc, _id: user._id.toString()}

        } catch (error) {
            console.log(error)
            throw new Error("Failed to login!")
        }

}

export const {signIn, signOut, auth} = NextAuth({
    ...authConfig,

    providers: [
        CredentialsProvider({
  
        async authorize(credentials, req) {
                try {
                    const {username, password} = credentials

                    const user = await signInWithCredentials({username, password})
                    return user
                } catch (error) {
                    return null
                }
            }
        })
    ],

    // ADD ADDITIONAL INFORMATION TO SESSION
    callbacks: {
        async jwt({ token, user }) {
        if (user) {
            token.username = user.username;
            token.img = user.img;
        }
        return token;
        },
        async session({ session, token }) {
        if (token) {
            session.user.username = token.username;
            session.user.img = token.img;
        }
        return session;
        },
    },
});
