import { Button } from "@/chadcn/Button";
import { Input } from "@/chadcn/Input";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useCollection } from "@/hooks/useCollection";
import React from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { Icon } from "@iconify/react";
import { Typography } from "@/chadcn/Typography";
import { NavBar } from "@/components/NavBar";

export const Landpage = () => {
  // Hooks
  const navigate = useNavigate(); // Get the navigate function
  const { user, signInWithGoogle, signOutUser, createUser, logInWithGoogle } = useAuthentication();
  const { checkAvailableUsername } = useCollection("users");

  // State
  const [username, setUsername] = React.useState("");
  const [isUsernameAvailable, setUsernameAvailable] = React.useState(null);
  const [isChecking, setChecking] = React.useState(false);

  // Refs
  const debounceRef = React.useRef(null);

  const handleSignIn = () => {
    // TODO: firebase functions or lambda functions when using aws to create a documents for the user
    signInWithGoogle().then((user) => {
      const data = {
        username: username || user.uid,
        photoURL: user.photoURL,
        name: user.displayName,
        email: user.email,
        providerData: user.providerData,
        reloadUserInfo: user.reloadUserInfo,
        uid: user.uid,
      };
      createUser(data, user.uid);
    });
  };

  

  const handleUsernameChange = ({ target }) => {
    setChecking(true);
    debounceRef.current?.cancel();

    // Declare
    const newUsername = target.value;
    const handleDebounce = () => {
      checkAvailableUsername(newUsername).then((value) => {
        setUsernameAvailable(value);
        setChecking(false);
      });
    };

    // Set input
    setUsername(newUsername);

    // start debouncing
    const debounceInstance = _.debounce(handleDebounce, 500);
    debounceRef.current = debounceInstance;
    debounceInstance();
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center">

      <div className="flex">
        <div className="w-full bg-blue-600 p-10 text-white">
          <div> 
            <div className="text-4xl font-bold font-Satoshi mb-4 p-10">
              Observe
            </div>
            <div className="mt-4 text-4xl p-10 font-medium">
              Explore the Sea of Jobs
            </div>
            <div className="mt-4 text-lg p-10">
              We curate career learning experiences for <br/>
              curious minds like yours
            </div>
            
            <div className="m-10">
              <Button
                className="mt-4 text-2xl p-10 font-medium text-blue-600"
                variant="outline"
                onClick={handleSignIn} // Connect to handleSignIn function
              >
                Access in Guest Mode
              </Button>
            </div>

            <div className="mt-4 text-sm p-10">
              AI / VR enabled for career immersion purposes.
            </div>

          </div>
        </div>

        <div className="w-2/5 bg-white items-center justify-center m-6">
          <div className="flex justify-center items-center">
            <img src="https://www.figma.com/file/SmttzZOlFETqjtOu9vUixc/image/9468fda13f2c0b4def6862340ec5be620ad162ef" alt="Image" className="w-36 h-36 m-2" />
          </div>          
          
          <div className="text-lg text-center justify-center">
            Welcome to Observe
          </div>

          <Button
            className="justify-center text-md px-24 py-4 m-16 font-medium text-white bg-blue-600 rounded-full"
            variant="outline"
            onClick={user ? signOutUser : signInWithGoogle} // Toggle between sign-in and sign-out
          >
            Sign up
          </Button>

          <div className="flex items-center">
            <div className="flex-1 border-t border-gray"></div>
            <span className="mx-3">or</span>
            <div className="flex-1 border-t border-gray w1/4"></div>
          </div>

          <Button
            className="justify-center text-md px-28 py-4 m-16 font-medium text-blue-600 rounded-full"
            variant="outline"
            onClick={user}
          >
            Login
          </Button>

          <div className="text-xs items-center text-center text-blue-600">
            <a href="google.com">Terms of Use | Privacy Policy</a>
          </div>
        </div>
      </div>

      {/* 
      
      ------------ New Playground -------------
      
      */}

      <div className="flex w-full h-full items-center justify-center">

      {/* <!-- Left Section --> */}
      <div className="w-3/5 h-full bg-blue-600 p-10 text-white">
        <div> 
          <div className="text-4xl font-bold font-Satoshi mb-4 p-10">
            Observe
          </div>
          <div className="mt-4 text-5xl p-10 font-medium">
            Explore the Sea of Jobs
          </div>
          <div className="mt-4 text-2xl p-10">
            We curate career learning experiences for <br/>
            curious minds like yours
          </div>
          
          <div className="m-10">
            <Button
              className="mt-4 text-2xl p-16 px-20 font-medium text-blue-600"
              variant="outline"
              onClick={user ? signOutUser : signInWithGoogle} // Toggle between sign-in and sign-out
            >
              Access in Guest Mode
            </Button>
          </div>

          <div className="mt-4 text-sm p-10">
            AI / VR enabled for career immersion purposes.
          </div>
        </div>
      </div>

      {/* <!-- Right Section --> */}
      <div className="w-2/5 h-full bg-white flex flex-col items-center justify-center m-6">
        <div className="flex justify-center items-center">
          <img src="https://www.figma.com/file/SmttzZOlFETqjtOu9vUixc/image/9468fda13f2c0b4def6862340ec5be620ad162ef" alt="Image" className="w-36 h-36 m-2" />
        </div>          
        
        <div className="text-2xl text-center justify-center">
          Welcome to Observe
        </div>

        <Button
          className="text-md px-24 m-20 font-medium text-white bg-blue-600 rounded-full"
          variant="outline"
          onClick={user ? signOutUser : signInWithGoogle} // Toggle between sign-in and sign-out
        >
          Sign up
        </Button>

        <div className="flex items-center mt-4">
          <div className="flex-1 border-t border-gray"></div>
          <span className="mx-3">or</span>
          <div className="flex-1 border-t border-gray w-1/4"></div>
        </div>

        <Button
          className="text-md px-28 py-4 m-16 font-medium text-blue-600 rounded-full"
          variant="outline"
          onClick={user}
        >
          Login
        </Button>

        <div className="text-sm items-center text-center text-blue-600">
          <a href="google.com">Terms of Use | Privacy Policy</a>
        </div>
      </div>
      </div>

      {/* 
      
      ------------ New Playground 3 -------------
      
      */}

        <div className="flex w-full h-full items-center justify-center">

        
        <div className="w-full h-full bg-white flex flex-col items-center justify-center">
            
            <div className="flex justify-center items-center">
              <img src="https://www.figma.com/file/SmttzZOlFETqjtOu9vUixc/image/9468fda13f2c0b4def6862340ec5be620ad162ef" alt="Image" className="w-36 h-36 m-2" />
            </div>
            
            <div className="text-2xl text-center justify-center m-4">
              Welcome back
            </div>

            <input
              type="email"
              placeholder="Enter your email"
              className="border rounded p-2 px-20 m-2 text-center"
            />

            <input
              type="password"
              placeholder="Enter password"
              className="border rounded p-2 px-20 text-center"
            />

          <div className="flex items-center mt-4">
              <div className="flex-1 border-t border-gray"></div>
              <span className="mx-3">or</span>
              <div className="flex-1 border-t border-gray w-1/4"></div>
            </div>

            <Button
              className="text-md px-24 m-2 font-medium text-white bg-blue-600 rounded-full"
              variant="outline"
              onClick={signInWithGoogle}
            >
              <img src="https://www.figma.com/file/SmttzZOlFETqjtOu9vUixc/image/dcc84ba1cffed7d70c3724602a3e792ea321ae73" alt="Image" className="w-5 h-5 m-4"/>
              Login with Google
            </Button>

            <div className="text-xs items-center text-center text-blue-600">
              <a href="google.com">Terms of Use | Privacy Policy</a>
            </div>
          </div>

        </div>
      </div>
  );
};
