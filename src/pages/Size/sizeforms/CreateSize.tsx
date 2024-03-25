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
import { Size } from '@/constants/data';
import supabase from '@/lib/supabase';
const sizeFormSchema = z
  .object({
    sizename: z.string().min(1, { message: 'category name is required' }),
  })


type SizeFormSchemaType = z.infer<typeof sizeFormSchema>;
interface Props {
  modalClose: () => void;
  openSize: ({ data: Size | object; show: boolean })
  fetchData: () => void
}

const CreateSize = ({ modalClose, openSize, fetchData }: Props) => {
  const defaultValues = {
    sizename:  (openSize.data as Size)?.name 
  }
  const form = useForm<SizeFormSchemaType>({
    resolver: zodResolver(sizeFormSchema),
    defaultValues:defaultValues
  });
  const postSize = async (values: SizeFormSchemaType) => {
    const { error } = await supabase.from('Size').insert({ name: values.sizename }).single()
    if (error) {
      throw error
    }
    modalClose()
    fetchData()


  }

  const EditSize = async (values: SizeFormSchemaType) => {
    console.log(values)
    const CategoryId = (openSize.data as Size)?.id
    await supabase.from('Size').update({ name: values.sizename }).eq('id', CategoryId);
    modalClose()
    fetchData()
  }
  const onSubmit = (values: SizeFormSchemaType) => {
    if ((openSize.data as Size)?.id) {
      EditSize(values)
    } else {
      postSize(values)
    }

  };

  return (
    <div className="px-2">


      <Heading
        title={(openSize.data as Size)?.name ? "Edit Size" : " Create New Size"}
        className="py-4 text-center"
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} >

          <div className="grid grid-cols-1 gap-x-8 gap-y-4">

            <FormField
              control={form.control}
              name="sizename"
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

export default CreateSize;
