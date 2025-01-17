const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      saludo: "Hola",
      users: [],
      categories: [],
      subcategories: [],
      products: [],
      services: [],
      productImages: [],
      inquiries: [],
    },
    actions: {
      // User Actions
      createUser: async (user) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
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
      getUsers: async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/users`);
          const data = await response.json();
          setStore({ users: data });
        } catch (error) {
          console.log(error);
        }
      },
      updateUser: async (userId, user) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
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
      deleteUser: async (userId) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
            method: "DELETE",
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

      // Category Actions
      createCategory: async (category) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(category),
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
      getCategories: async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
          const data = await response.json();
          setStore({ categories: data });
        } catch (error) {
          console.log(error);
        }
      },
      updateCategory: async (categoryId, category) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/${categoryId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(category),
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
      deleteCategory: async (categoryId) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/${categoryId}`, {
            method: "DELETE",
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

      // Subcategory Actions
      createSubcategory: async (subcategory) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/subcategories`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(subcategory),
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
      getSubcategories: async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/subcategories`);
          const data = await response.json();
          setStore({ subcategories: data });
        } catch (error) {
          console.log(error);
        }
      },
      updateSubcategory: async (subcategoryId, subcategory) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/subcategories/${subcategoryId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(subcategory),
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
      deleteSubcategory: async (subcategoryId) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/subcategories/${subcategoryId}`, {
            method: "DELETE",
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

      // Product Actions
      createProduct: async (product) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
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
      getProducts: async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
          const data = await response.json();
          setStore({ products: data });
        } catch (error) {
          console.log(error);
        }
      },
      updateProduct: async (productId, product) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
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
      deleteProduct: async (productId) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}`, {
            method: "DELETE",
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

      // ProductImage Actions
      createProductImage: async (productImage) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/product_images`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productImage),
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
      getProductImages: async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/product_images`);
          const data = await response.json();
          setStore({ productImages: data });
        } catch (error) {
          console.log(error);
        }
      },
      updateProductImage: async (productImageId, productImage) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/product_images/${productImageId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productImage),
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
      deleteProductImage: async (productImageId) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/product_images/${productImageId}`, {
            method: "DELETE",
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

      // Service Actions
      createService: async (service) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/services`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(service),
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
      getServices: async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/services`);
          const data = await response.json();
          setStore({ services: data });
        } catch (error) {
          console.log(error);
        }
      },
      updateService: async (serviceId, service) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/services/${serviceId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(service),
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
      deleteService: async (serviceId) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/services/${serviceId}`, {
            method: "DELETE",
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
    },
  };
};

export default getState;