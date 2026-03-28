import FormInput from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { faker } from "@faker-js/faker";

const createProductAction = async (formData: FormData) => {
  "use server";
  const name = faker.commerce.productName();
  console.log(name);
};

function CreateProductPage() {
  const name = faker.commerce.productName();
  const company = faker.company.name();
  const description = faker.lorem.paragraph({ min: 10, max: 12 });
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">Create Product</h1>
      <div className="border rounded-md p-8">
        <form action={createProductAction}>
          <FormInput type="text" name="name" label="product name" defaultValue={name} />
          <Button size="lg" type="submit">
            Create Product
          </Button>
        </form>
      </div>
    </section>
  );
}
export default CreateProductPage;
