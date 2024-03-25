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
import { useToast } from "@/components/ui/use-toast"


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

const CreateCategory = ({ modalClose, openCategory, fetchData }: Props) => {
  const defaultValues = {
    categoryname:  (openCategory.data as Category)?.name 
  }
  const {toast} = useToast()
  const form = useForm<StudentFormSchemaType>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues:defaultValues
  });
  const postCategories = async (values: StudentFormSchemaType) => {
    const { error } = await supabase.from('Category').insert({ name: values.categoryname }).single()
    if (error) {
      toast({
        className: (
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
        ),
        title: `${error.details || "something wrong happened"}`,
        variant: "destructive", 
      });
    }else{
      toast({
        className: (
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
        ),
        title: "Category created successfully.",
        variant: "default", 
      });
    }
    modalClose()
    fetchData()


  }

  const EditCategories = async (values: StudentFormSchemaType) => {
    const CategoryId = (openCategory.data as Category)?.id
   const {error} = await supabase.from('Category').update({ name: values.categoryname }).eq('id', CategoryId);
    if (error) {
      toast({
        className: (
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
        ),
        title: `${error.details || "something wrong happened"}`,
        variant: "destructive", 
      });
    }else{
      toast({
        className: (
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
        ),
        title: "Category edited successfully.",
        variant: "default", 
      });
    }
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
