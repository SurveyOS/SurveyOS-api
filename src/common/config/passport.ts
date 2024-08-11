import { userService } from "@/api/users/service";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "../utils/envConfig";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        const name = profile.displayName;
        const googleId = profile.id;
        const avatar = profile.photos?.[0].value;

        if (!email) {
          return done(null, false, {
            message: "No email associated with this account!",
          });
        }

        const googleLoginResponse = await userService.googleSignUpOrLogin(googleId, email, name, avatar);

        if (googleLoginResponse.success && googleLoginResponse.response) {
          done(null, googleLoginResponse.response);
        } else {
          done(null, false, { message: "Failed to log in with Google" });
        }
      } catch (error) {
        done(error);
      }
    },
  ),
);

export default passport;
