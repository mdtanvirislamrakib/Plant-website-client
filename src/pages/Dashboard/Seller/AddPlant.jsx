import AddPlantForm from '../../../components/Form/AddPlantForm'
import { imageUpload } from '../../../API/Utils';
import axios from 'axios';
import { useContext, useState } from 'react';
import { AuthContext } from '../../../providers/AuthProvider';
import toast from 'react-hot-toast';

const AddPlant = () => {
  const { user } = useContext(AuthContext);


  const [isUploading, setIsUploading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)

    const form = e.target;
    const name = form?.name?.value;
    const category = form?.category?.value;
    const description = form?.description?.value;
    const price = form?.price?.value;
    const quantity = form?.quantity?.value;
    const image = form?.image?.files[0];

    try {
      const imageUrl = await imageUpload(image)
      const plantData = {
        name,
        category,
        description,
        price,
        quantity,
        image: imageUrl,
        seller: {
          name: user?.displayName,
          email: user?.email,
          image: user?.photoURL
        }
      }

      console.table(plantData)

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/add-plant`, plantData)

      if (data?.insertedId) {
        toast.success("Your Plant Added Successfully!!! yesssssssss")
        form.reset()
      }

    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false)
    }

  }

  return (
    <div>
      {/* Form */}
      <AddPlantForm handleFormSubmit={handleFormSubmit} isUploading={isUploading} />
    </div>
  )
}

export default AddPlant
