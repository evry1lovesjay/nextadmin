export const authConfig ={
    providers:[],
    pages:{
        signIn: "/login",
    },
    callbacks:{
        authorized({auth, request}){
            const isLoggedIn = auth?.user
            const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard")
            // if(!isLoggedIn && !isOnDashboard){
            //     return '/login'
            // } else if (isLoggedIn && isOnDashboard){
            //     return '/dashboard'
            // } else {
            //     return true
            // }

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false;
              } else if (isLoggedIn) {
                return Response.redirect(new URL("/dashboard", request.nextUrl));
              }
              return true;
        },
    },
};