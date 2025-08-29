import { createContext } from "react";
// import { PostContext } from './PostContext';
import axios from "axios";

 export let PostContext = createContext();


 export default function PostContextProvider(props) {
    

// 


  return (
    <PostContext.Provider value={{  }}>
      {props.children}
    </PostContext.Provider>
  );
}

