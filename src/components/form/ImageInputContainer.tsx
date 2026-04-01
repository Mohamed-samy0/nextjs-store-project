"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import FormContainer from "./FormContainer";
import ImageInput from "./ImageInput";
import { SubmitButton } from "./Button";
import { type actionFunction } from "@/utils/types";

type ImageInputContainerProps = {
  image: string;
  name: string;
  action: actionFunction;
  text: string;
  children?: React.ReactNode;
};

function ImageInputContainer(props: ImageInputContainerProps) {
  const { image, name, action, text } = props;
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="mb-8">
      <Image
        src={image}
        alt={name}
        width={200}
        height={200}
        className="object-cover rounded mb-4 w-[200px] h-[200px]"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowForm((prev) => !prev)}
        className="capitalize"
      >
        {text}
      </Button>
      {showForm && (
        <div className="max-w-md mt-4">
          <FormContainer action={action}>
            {props.children}
            <ImageInput />
            <SubmitButton text={text} size="sm" className="capitalize" />
          </FormContainer>
        </div>
      )}
    </div>
  );
}
export default ImageInputContainer;
