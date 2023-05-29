import * as Yup from "yup";


const formSchema = Yup.object({
  question: Yup.string().required(),
  website: Yup.string().url().required(),
});

export default formSchema;