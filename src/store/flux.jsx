const getState = ({ getStore, getActions, setStore }) => {

  // import.meta.env.VITE_API_URL;

  return {
    store: {
      saludo: "Hola",
      items: [],
    },
    actions: {
      createItem: async (item) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/items`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
          });
          if (!response.ok) {
            return false;
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.log(error);
        }
      },
      getItems: async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/items`);
          const data = await response.json();
          if (response.ok) {
            setStore({ items: data });
          }
        } catch (error) {
          console.log(error);
        }
      },
      deleteItem: async (item_id) => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/items/${item_id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            return false;
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.log(error);
        }
      },
    },
  };
};

export default getState;
