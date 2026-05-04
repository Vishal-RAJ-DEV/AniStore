import { apiSlice } from "./apiSlice"
import { ORDER_URL , PAYPAL_URL } from "../constant"

const orderApiSlice  = apiSlice.injectEndpoints({
    endpoints : ( builder ) =>({
        createOrder : builder.mutation({
            query : (data) =>({
                url : ORDER_URL,
                method : "POST",
                body : data
            }),
            invalidatesTags : ['Orders']
        }),
        getOrderDetails : builder.query({
            query : (orderId) =>({
                url : `${ORDER_URL}/${orderId}`,
                method : "GET"
            }),
            providesTags : (result, error, orderId) => [{ type: 'Orders', id: orderId }]
        }),
        payOrder : builder.mutation({
            query : ({ orderId, details }) =>({
                url : `${ORDER_URL}/${orderId}/pay`,
                method : "PUT",
                body : details
            }),
            invalidatesTags : (result, error, { orderId }) => [{ type: 'Orders', id: orderId }]
        }),
        getMyOrders : builder.query({
            query : () =>({
                url : `${ORDER_URL}/mine`,
                method : "GET"
            }),
            providesTags : ['Orders']
        }),
        getOrders : builder.query({
            query : () =>({
                url : ORDER_URL,
                method : "GET"
            }),
            providesTags : ['Orders']
        }),
        deliverOrder : builder.mutation({
            query : (orderId) =>({
                url : `${ORDER_URL}/${orderId}/deliver`,
                method : "PUT",
            }),
            invalidatesTags : (result, error, orderId) => [{ type: 'Orders', id: orderId }]
        }),
        cancelOrder : builder.mutation({
            query : (orderId) =>({
                url : `${ORDER_URL}/${orderId}/cancel`,
                method : "DELETE",
            }),
            invalidatesTags : (result, error, orderId) => [{ type: 'Orders', id: orderId }]
        }),
        totalorders : builder.query({
            query : () =>({
                url : `${ORDER_URL}/totalorders`,
                method : "GET"
            })
        }),
        totalsales : builder.query({
            query : () =>({
                url : `${ORDER_URL}/totalsales`,
                method : "GET"
            })
        }),
        totalsalesbydate : builder.query({
            query : () =>({
                url : `${ORDER_URL}/totalsalesbydate`,
                method : "GET"
            })
        }),
        getpaypalclientId : builder.query({
            query : () =>({
                url : `${PAYPAL_URL}`,
                method : "GET"
            })
        })  
    })
})

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetMyOrdersQuery,
    useGetOrdersQuery,
    useDeliverOrderMutation,
    useCancelOrderMutation,
    useTotalordersQuery,
    useTotalsalesQuery,
    useTotalsalesbydateQuery,
    useGetpaypalclientIdQuery
} = orderApiSlice;
