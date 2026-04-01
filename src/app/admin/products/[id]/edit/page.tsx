import {
  fetchAdminProduct,
  updateProductAction,
  updateProductImageAction,
} from "@/utils/actions";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import PriceInput from "@/components/form/PriceInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import CheckboxInput from "@/components/form/CheckboxInput";
import { SubmitButton } from "@/components/form/Button";
import ImageInputContainer from "@/components/form/ImageInputContainer";

async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await fetchAdminProduct(id);
  const { name, company, price, description, featured } = product;
  return (
    <section>
      <h1 className="text-2xl font-bold mb-8 capitalize">update product</h1>
      <div className="border rounded p-8">
        <ImageInputContainer
          image={product.image}
          name={product.name}
          action={updateProductImageAction}
          text="update image"
        >
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="url" value={product.image} />
        </ImageInputContainer>
        <FormContainer action={updateProductAction}>
          <div className="grid gap-4 md:grid-cols-2 my-4">
            <input type="hidden" name="id" value={id} />
            <FormInput type="text" name="name" label="product name" defaultValue={name} />
            <FormInput
              type="text"
              name="company"
              label="company"
              defaultValue={company}
            />
            <PriceInput defaultValue={price} />
          </div>
          <TextAreaInput
            name="description"
            labelText="product description"
            defaultValue={description}
          />
          <div className="mt-6">
            <CheckboxInput name="featured" label="featured" defaultChecked={featured} />
          </div>
          <SubmitButton text="update product" className="mt-8" />
        </FormContainer>
      </div>
    </section>
  );
}
export default EditProductPage;
