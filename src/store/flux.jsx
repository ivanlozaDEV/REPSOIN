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

      login: async (credentials) => {
        const apiUrl = import.meta.env.VITE_API_URL;
        console.log("API URL:", apiUrl); // A
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });
          if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.error };
          }
          const data = await response.json();
          localStorage.setItem("token", data.access_token);
          return { success: true };
        } catch (error) {
          console.log(error);
          return { success: false, error: "An error occurred" };
        }
      },
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
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
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
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
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
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              name: category.name,
              image_url: category.image_url, // Ensure this line is present
            }),
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error creating category:", errorData);
            return false;
          }
    
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error creating category:", error);
          return false;
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
      getCategory: async (id) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/${id}`)
          if (!response.ok) {
            throw new Error("Failed to fetch category")
          }
          const data = await response.json()
          return data
        } catch (error) {
          console.error("Error fetching category:", error)
        }
      },

      getSubcategoriesByCategory: async (categoryId) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/subcategories?category_id=${categoryId}`)
          if (!response.ok) {
            throw new Error("Failed to fetch subcategories by category")
          }
          const data = await response.json()
          return data
        } catch (error) {
          console.error("Error fetching subcategories by category:", error)
        }
      },
    
      getProductsByCategory: async (categoryId) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/products?category_id=${categoryId}`)
          if (!response.ok) {
            throw new Error("Failed to fetch products by category")
          }
          const data = await response.json()
          return data
        } catch (error) {
          console.error("Error fetching products by category:", error)
        }
      },
      updateCategory: async (categoryId, category) => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/${categoryId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
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
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/${categoryId}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
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
      createSubcategory: async (subcategory) =>
        {
          try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${import.meta.env.VITE_API_URL}/subcategories`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                name: subcategory.name,
                category_id: subcategory.category_id,
                image_url: subcategory.image_url,
              }),
            })
            if (!response.ok) {
              const errorData = await response.json()
              console.error("Error creating subcategory:", errorData)
              throw new Error(errorData.message || "Failed to create subcategory")
            }
            const data = await response.json()
            return data;
          } catch (error) {
            console.error("Error creating subcategory:", error)
            throw error
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

      getSubcategory: async (id) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/subcategories/${id}`)
          if (!response.ok) {
            throw new Error("Failed to fetch subcategory")
          }
          const data = await response.json()
          return data
        } catch (error) {
          console.error("Error fetching subcategory:", error)
        }
      },

      updateSubcategory: async (subcategoryId, subcategory) =>
        {
          try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${import.meta.env.VITE_API_URL}/subcategories/${subcategoryId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                name: subcategory.name,
                category_id: subcategory.category_id,
                image_url: subcategory.image_url,
              }),
            })
            if (!response.ok) {
              const errorData = await response.json()
              console.error("Error updating subcategory:", errorData)
              throw new Error(errorData.message || "Failed to update subcategory")
            }
            const data = await response.json()
            return data;
          } catch (error) {
            console.error("Error updating subcategory:", error)
            throw error
          }
        }
        ,
      deleteSubcategory: async (subcategoryId) => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_API_URL}/subcategories/${subcategoryId}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
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
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
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
      getProduct: async (id) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`)
          if (!response.ok) {
            throw new Error("Failed to fetch product")
          }
          const data = await response.json()
          return data
        } catch (error) {
          console.error("Error fetching product:", error)
        }
      },
      updateProduct: async (productId, product) => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
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
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
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
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_API_URL}/product_images`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(productImage),
          });
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error creating product image:", errorData);
            throw new Error(errorData.message || 'Failed to create product image');
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error creating product image:", error);
          throw error;
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
              "Authorization": `Bearer ${token}`
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
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_API_URL}/product_images/${productImageId}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
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
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_API_URL}/services`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              name: service.name,
              description: service.description,
              image_url: service.image_url,
            }),
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
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_API_URL}/services/${serviceId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              name: service.name,
              description: service.description,
              image_url: service.image_url,
            }),
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
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_API_URL}/services/${serviceId}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
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
      getInquiries: async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/inquiries`, {
            method: "GET",
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

      getInquiry: async (inquiryId) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/inquiries/${inquiryId}`, {
            method: "GET",
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

      addInquiry: async (inquiryData) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/inquiries`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(inquiryData),
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

      updateInquiry: async (inquiryId, inquiryData) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/inquiries/${inquiryId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(inquiryData),
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

      deleteInquiry: async (inquiryId) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/inquiries/${inquiryId}`, {
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