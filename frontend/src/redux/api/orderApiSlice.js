import { apiSlice } from "./apiSlice"
import { ORDER_URL , PAYPAL_URL } from "../constant"
``
const orderApiSlice  = apiSlice.injectEndpoints({
    endpoints : ( builder ) =>({
        createOrder : builder.mutation({
            query : (data) =>({
                url : ORDER_URL,
                method : "POST",
                body : data
            })
        }),
        getOrderById : builder.query({
            query : ( orderId) =>({
                url : `${ORDER_URL}/${orderId}`,
                method : "GET"
            })
        }),
        getallorders : builder.query  ({
            query : () =>({
                url : ORDER_URL,
                method : "GET"
            })
        }),
        getuserOrder : builder.query({
            query : () =>({
                url : `${ORDER_URL}/mine`,
                method : "GET"
            })
        }),
        getOrderById : builder.query({
            query : ( userId) =>({
                url : `${ORDER_URL}/${userId}`,
                method : "GET"
            })
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
        makeorderAsPaid : builder.mutation({
            query : ({ id , paymentResult }) =>({
                url : `${ORDER_URL}/${id}/pay`,
                method : "PUT",
                body : paymentResult
            })
        }),
        makeorderAsDelivered : builder.mutation({
            query : (id) =>({
                url : `${ORDER_URL}/${id}/deliver`,
                method : "PUT",
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
    useGetOrderByIdQuery,
    useGetallordersQuery,
    useGetuserOrderQuery,
    useTotalordersQuery,
    useTotalsalesQuery,
    useTotalsalesbydateQuery,
    useMakeorderAsPaidMutation,
    useMakeorderAsDeliveredMutation
} = orderApiSlice;