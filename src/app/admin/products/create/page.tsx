import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import { faker } from "@faker-js/faker";
import { createProductAction } from "@/utils/actions";
import PriceInput from "@/components/form/PriceInput";
import ImageInput from "@/components/form/ImageInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import CheckboxInput from "@/components/form/CheckboxInput";
import { SubmitButton } from "@/components/form/Button";

function CreateProductPage() {
  const name = faker.commerce.productName();
  const company = faker.company.name();
  const description = faker.lorem.paragraph({ min: 10, max: 12 });
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">Create Product</h1>
      <div className="border rounded-md p-8">
        <FormContainer action={createProductAction}>
          <div className="grid md:grid-cols-2 gap-4 my-4">
            <FormInput type="text" name="name" label="product name" defaultValue={name} />
            <FormInput
              type="text"
              name="company"
              label="company"
              defaultValue={company}
            />
            <PriceInput />
            <ImageInput />
          </div>
          <TextAreaInput
            name="description"
            labelText="description"
            defaultValue={description}
          />
          <div className="mt-6">
            <CheckboxInput name="featured" label="featured" />
          </div>
          <SubmitButton text="Create product" className="mt-8" />
        </FormContainer>
      </div>
    </section>
  );
}
export default CreateProductPage;
