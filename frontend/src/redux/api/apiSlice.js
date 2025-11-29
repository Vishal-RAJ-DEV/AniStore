// Importing necessary functions from Redux Toolkit Query
import {fetchBaseQuery , createApi} from "@reduxjs/toolkit/query/react"
// Importing the base URL from a constants file
import { BASE_URL } from "../constant"

// Creating a base query configuration using fetchBaseQuery
// This sets up the foundation for all API calls with the base URL
const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL, // The root URL for all API requests
})

// Creating the API slice using createApi
export const apiSlice = createApi({
    // Using the configured base query from above
    baseQuery,
    
    // Defining cache tags for invalidation
    // These tags help manage cache invalidation when data changes
    // For example, when a user updates their profile, the 'User' tag can be invalidated
    tagTypes: ['User', 'Products', 'Category', 'Orders'],
    
    // Defining the endpoints (empty for now)
    // This will be extended by other slices using apiSlice.injectEndpoints()
    // Each entity type (users, products, etc.) will define their own endpoints
    endpoints: () => ({}),
})