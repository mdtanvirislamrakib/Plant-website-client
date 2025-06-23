import AddPlantForm from '../../../components/Form/AddPlantForm'
import { imageUpload } from '../../../API/Utils';

const AddPlant = () => {

  const handleFormSubmit = async(e) => {
    e.preventDefault()
    const form = e.target;
    const name = form?.name?.value;
    const category = form?.category?.value;
    const description = form?.description?.value;
    const price = form?.price?.value;
    const quantity = form?.quantity?.value;
    const image = form?.image?.files[0];

    const imageUrl = await imageUpload(image)
    const plantData = {
      name, 
      category, 
      description, 
      price, 
      quantity, 
      image: imageUrl
    }

    console.table(plantData)

  }

  return (
    <div>
      {/* Form */}
      <AddPlantForm handleFormSubmit = {handleFormSubmit} />
    </div>
  )
}

export default AddPlant
