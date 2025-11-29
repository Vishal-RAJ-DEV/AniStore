import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constant";


const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) =>({
        createCategory : builder.mutation({
            query : (newCategory) => ({
                url : `${CATEGORY_URL}`,
                method : "POST",
                body : newCategory,
            })
        }),
        updateCategory : builder.mutation({
            query : ({CategoryId, ...data}) => ({ //here ...data is the rest of the data except CategoryId
                url : `${CATEGORY_URL}/${CategoryId}`,
                method : "PUT",
                body : data //destructuring to get the id and the rest of the data
            })
        }),
        deleteCategory : builder.mutation({
            query : (CategoryId) => ({
                url : `${CATEGORY_URL}/${CategoryId}`,
                method : "DELETE",
            })
        }),
        fetchCategories : builder.query({
            query : () => ({
                url : `${CATEGORY_URL}/categories`,
            })
        })
    })
})

export const { useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation, useFetchCategoriesQuery } = categoryApiSlice;