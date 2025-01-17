import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext.jsx";
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/react";

function Home() {
  const { store, actions } = useContext(Context);
  const { theme, setTheme } = useTheme();
  const [id, setId] = useState(0);

  


  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}

export default Home;
