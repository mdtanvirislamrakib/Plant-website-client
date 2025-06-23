import AddPlantForm from '../../../components/Form/AddPlantForm'
import { imageUpload } from '../../../API/Utils';
import axios from 'axios';
import { useContext, useState } from 'react';
import { AuthContext } from '../../../providers/AuthProvider';
import toast from 'react-hot-toast';

const AddPlant = () => {
  const { user } = useContext(AuthContext);


  const [isUploading, setIsUploading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(null);
  const [imageUploadError, setImageUploadError] = useState('')

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)

    const form = e.target;
    const name = form?.name?.value;
    const category = form?.category?.value;
    const description = form?.description?.value;
    const price = form?.price?.value;
    const quantity = form?.quantity?.value;
    // const image = form?.image?.files[0];

    try {
      const plantData = {
        name,
        category,
        description,
        price,
        quantity,
        image: uploadingImage,
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


  const handleImageUpload = async e => {
    e.preventDefault();
    try {
      const image = e.target.files[0];
      const imageUrl = await imageUpload(image)
      setUploadingImage(imageUrl)
    } catch (error) {
      setImageUploadError("Image not uploading!!")
      console.log(error);
    }

  }


  return (
    <div>
      {/* Form */}
      <AddPlantForm
        handleFormSubmit={handleFormSubmit}
        isUploading={isUploading}
        uploadingImage={uploadingImage}
        handleImageUpload={handleImageUpload}
        imageUploadError={imageUploadError}
      />
    </div>
  )
}

export default AddPlant
