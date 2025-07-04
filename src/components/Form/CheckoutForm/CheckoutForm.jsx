import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import "./common.css"
import { FadeLoader } from 'react-spinners';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

const CheckoutForm = ({ totalPrice, closeModal, orderData, fetchPlant }) => {

    const { user } = useAuth();

    const axiosSecure = useAxiosSecure();
    const [paymentError, setPaymentError] = useState(null);
    const [processing, setProcessing] = useState(false)
    const [clientSecret, setClientSecret] = useState("")

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        const getClientSEcret = async () => {

            // server request....
            const { data } = await axiosSecure.post("/create-payment-intent", {
                quantity: orderData?.quantity,
                plantId: orderData?.plantId
            })
            setClientSecret(data?.clientSecret)


        }
        getClientSEcret()
    }, [axiosSecure, orderData])

    const handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();
        setProcessing(true);

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            setPaymentError(error.message)
            setProcessing(false)
            return
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            setPaymentError(null)
        }

        const result = await stripe
            .confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: user?.displayName,
                        email: user?.email
                    },
                },
            })

        if (result?.error) {
            return setPaymentError(result?.error?.message)

        }

        if (result?.paymentIntent?.status === "succeeded") {
            // save order data in DB
            orderData.transctionId = result?.paymentIntent?.id;
            try {
                const { data } = await axiosSecure.post("/order", orderData)
                console.log(data);
                if (data?.insertedId) {
                    toast.success("Order Place Successfully")
                }
                const {data: result} = await axiosSecure.patch(`/quantity-update/${orderData?.plantId}`, {quantityToUpdate: orderData?.quantity, status: "decrease"})

                fetchPlant()
            } catch (error) {
                console.log(error);
            } finally {
                setProcessing(false)
                setPaymentError(null)
                closeModal()
            }

            // update product quantity in db form plant collection
        }

    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }}
            />
            {
                paymentError && <p className='text-red-600 mb-5'>{paymentError}</p>
            }
            <div className='flex items-center justify-between'>
                <button className='bg-lime-600 text-white font-bold px-3 py-1 rounded-sm cursor-pointer' type="submit" disabled={!stripe || processing}>
                    {`pay $ ${totalPrice}`}
                    {processing ? <FadeLoader size={10} /> : ""}
                </button>
                <button onClick={() => closeModal()} className='bg-red-600 text-white font-bold px-3 py-1 rounded-sm cursor-pointer' type="button">
                    cancel
                </button>
            </div>

        </form>
    );
};

export default CheckoutForm;