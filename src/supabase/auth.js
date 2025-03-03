import supabase from '../supabaseClient';

class AuthService
{
    async getCurrentUser() 
    {
        try 
        {
            const { data, error } = await supabase.auth.getUser();

            if (error) 
                {
                console.log("Couldn't get current logged in user:", error.message);
                throw error;
            }

            return data.user; 
        } 
        catch (error) {
            console.error("Error fetching current user:", error.message);
            throw error;
        }
    }

    async signUpNewUser({email, password, Fullname})
    {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: 'http://localhost:5173/signin',
                    data: {
                        Fullname
                    }
                },
            });

            if (error) throw error;

            if (data?.user) {
                const { error } = await supabase.from('profiles').insert({
                    id: data.user.id,
                    email: email,
                    role: 'student',
                    user_id: data.user.id
                });

                if (error) {
                    console.error("Insert Error:", error.message);
                }

                alert("Signup successful, verify your email!");
            }

            const domain = email.split('@')[1].toLowerCase();
            switch (domain) {
                case 'gmail.com':
                    window.location.assign('https://mail.google.com');
                    break;
                case 'yahoo.com':
                    window.location.assign('https://mail.yahoo.com');
                    break;
                case 'outlook.com':
                    window.location.assign('https://outlook.live.com');
                    break;
                default:
                    window.alert('Please check your email manually.');
            }
        }
        catch (error)
        {
            alert(`Signup failed: ${error.message}`);
            throw error;
        }
    }

    async signInWithEmail({ email, password }){
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
      
          if (error) {
            throw error;
          }
          return { data }; // Ensure you return the data object
        } catch (error) {
          throw new Error(error.message);
        }
    };

    async signOut() 
    {
        const { error } = await supabase.auth.signOut();
        
        if (error) 
        {
            console.error("Sign out error:", error.message);
            return error;
        }
    
        console.log("Signed out successfully");
    }
    

      
}

const authService = new AuthService();
export default authService;