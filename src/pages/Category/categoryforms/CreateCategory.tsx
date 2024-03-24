import Heading from '@/components/shared/heading';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Category } from '@/constants/data';
import supabase from '@/lib/supabase';
const categoryFormSchema = z
  .object({
    categoryname: z.string().min(1, { message: 'category name is required' }),
  })


type StudentFormSchemaType = z.infer<typeof categoryFormSchema>;
interface Props {
  modalClose: () => void;
  openCategory: ({ data: Category | object; show: boolean })
  fetchData: () => void
}
// {(openCategory.data as Category)?.name  ? "Edit" : "Add New"}
const CreateCategory = ({ modalClose, openCategory, fetchData }: Props) => {
  const form = useForm<StudentFormSchemaType>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {}
  });
  const postCategories = async (values: StudentFormSchemaType) => {
    const { error } = await supabase.from('Category').insert({ name: values.categoryname }).single()
    if (error) {
      throw error
    }
    modalClose()
    fetchData()


  }

  const EditCategories = async (values: StudentFormSchemaType) => {
    console.log(values)
    const CategoryId = (openCategory.data as Category)?.id
    await supabase.from('Category').update({ name: values.categoryname }).eq('id', CategoryId);
    modalClose()
    fetchData()
  }
  const onSubmit = (values: StudentFormSchemaType) => {
    if ((openCategory.data as Category)?.id) {
      EditCategories(values)
    } else {
      postCategories(values)
    }

  };

  return (
    <div className="px-2">


      <Heading
        title={(openCategory.data as Category)?.name ? "Edit Category" : " Create New Category"}
        className="py-4 text-center"
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} >

          <div className="grid grid-cols-1 gap-x-8 gap-y-4">

            <FormField
              control={form.control}
              name="categoryname"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter category name"
                      {...field}
                      className=" px-4 py-6 shadow-inner drop-shadow-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>

          <div className="flex items-center justify-center gap-4 mt-[6rem]">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full "
              size="lg"
              onClick={modalClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-full" size="lg">
          Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCategory;
