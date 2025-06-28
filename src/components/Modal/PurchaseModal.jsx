import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../providers/AuthProvider'
import Swal from 'sweetalert2';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../Form/CheckoutForm/CheckoutForm';



// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

// published stripe key ==>> pk_test_51ReKbrIros3mgqZXEpNfcjIYhCTfhnVb13KUycpM38F0QbNT79drtRZ7VOwqZFK5SCkPMxgfPUr9gOhawF8hFUPl006yn69M3l


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_KEY)


const PurchaseModal = ({ closeModal, isOpen, plant }) => {

  const { user } = useContext(AuthContext);

  // Total Price Calculation
  const { _id, name, category, price, quantity, seller, image } = plant

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(price)
  const [orderData, setOrderData] = useState({
    customer: {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL
    },
    seller,
    plantId: _id,
    quantity: 1,
    price: price,
    plantName: name,
    plantCategory: category,
    plantImage: image,

  })

  useEffect(() => {
    if (user) {
      setOrderData(prev => {
        return {
          ...prev,
          customer: {
            name: user?.displayName,
            email: user?.email,
            image: user?.photoURL
          }
        }
      })
    }

  }, [user])


  const handleQuantity = value => {
    const totalQuantity = parseInt(value);

    if (totalQuantity > quantity) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You can't added more your available quantity!",
      });
    }

    const calculatedPrice = totalQuantity * price || 0;

    setSelectedQuantity(totalQuantity);
    setTotalPrice(calculatedPrice)

    setOrderData(prev => {
      return {
        ...prev,
        price: calculatedPrice,
        quantity: totalQuantity,
      }
    })
  }







  return (
    <Dialog
      open={isOpen}
      as='div'
      className='relative z-10 focus:outline-none '
      onClose={closeModal}
    >
      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-center justify-center p-4'>
          <DialogPanel
            transition
            className='w-full max-w-md bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-xl rounded-2xl'
          >
            <DialogTitle
              as='h3'
              className='text-lg font-medium text-center leading-6 text-gray-900'
            >
              Review Info Before Purchase
            </DialogTitle>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Plant: {name}</p>
            </div>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Category: {category}</p>
            </div>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Customer: {user?.displayName}</p>
            </div>

            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Price: $ {price}</p>
            </div>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Available Quantity: {quantity}</p>
            </div>

            <hr className='mt-2' />
            <p className='text-lg text-center font-bold'>Order Info</p>
            <div className='mt-2'>
              <input
                value={selectedQuantity}
                onChange={e => handleQuantity(e.target.value)}
                type="number"
                min={1}
                className='border rounded-sm px-3 py-1 outline-none w-full'
                placeholder='Quantity' />
            </div>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Selected Quantity: {selectedQuantity}</p>
            </div>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Total Price: {totalPrice}</p>
            </div>

            {/* Stripe checkout form */}

            <Elements stripe={stripePromise}>
              <CheckoutForm totalPrice = {totalPrice} closeModal = {closeModal} orderData ={ orderData} />
            </Elements>


          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default PurchaseModal
