import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext.jsx";
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/react";

function Home() {
  const { store, actions } = useContext(Context);
  const { theme, setTheme } = useTheme();
  const [id, setId] = useState(0);

  const createItem = async (item) => {
    const response = await actions.createItem(item);
    console.log(response);
    actions.getItems();
  };

  const deleteItem = async (item_id) => {
    const response = await actions.deleteItem(item_id);
    console.log(response);
    actions.getItems();
  };

  useEffect(() => {
    actions.getItems();
  }, []);

  return (
    <div>
      <div>
        The current theme is: {theme}
        <Button color="primary" onClick={() => setTheme("light")}>
          Light Mode
        </Button>
        <Button color="primary" onClick={() => setTheme("dark")}>
          Dark Mode
        </Button>
      </div>
      <h1>{store.saludo}</h1>
      <button onClick={() => createItem({ name: "Hola" })}>Create</button>
      <select
        onChange={(e) => {
          setId(e.target.value);
        }}
      >
        {store.items.length > 0 &&
          store.items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
      </select>
      <button onClick={() => deleteItem(id)}>Delete</button>
    </div>
  );
}

export default Home;
