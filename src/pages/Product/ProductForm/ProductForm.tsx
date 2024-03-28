import Heading from '@/components/shared/heading';
import { Button } from '@/components/ui/button';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Product } from '@/constants/data';
import supabase from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Size } from '@/constants/data';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent
} from '@/components/ui/select';

const productFormSchema = z.object({
  productname: z.string().min(1, { message: 'product name is required' }),
  size: z.string().min(1, { message: 'size is required' }),
  price: z.string().min(1, { message: 'Price is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  image: z.string().min(1, { message: 'image is required' })
});

type StudentFormSchemaType = z.infer<typeof productFormSchema>;
interface Props {
  modalClose: () => void;
  openProduct: { data: Product | object; show: boolean };
}

const CreateProduct = ({ modalClose, openProduct }: Props) => {
  const defaultValues = {
    productname: (openProduct.data as Product)?.name
  };

  const form = useForm<StudentFormSchemaType>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues
  });

  const [size, setSize] = useState<Size[]>([]);
  const [files, setFiles] = useState<File | undefined>();
  const [preview, setpreview] = useState<string>('');

  const imageFileUrl =
    'https://xwsfeqsmtvzdcxhmlvig.supabase.co/storage/v1/object/sign/image/';

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('Size').select('*');
      if (error) {
        return;
      }

      setSize(data);
    } catch (error) {
      // Handle error
    } finally {
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = (value: StudentFormSchemaType) => {
    if (typeof files === 'undefined') return;
    const formData = new FormData();
    formData.append('files', files);
  };

  async function handleImage(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };
    const file = target.files[0];
    setFiles(file);
    const formData = new FormData();
    formData.append('file', file);
    const { data, error } = await supabase.storage
      .from('image')
      .upload(file.name, file);
    console.log(data);
    setpreview(data?.path as string);
  }

  return (
    <div className="px-2 ">
      <Heading
        title={
          (openProduct.data as Product)?.name
            ? 'Edit Product'
            : ' Create New Product'
        }
        className="text-md pb-3 text-center"
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {/* //product name */}
            <FormField
              control={form.control}
              name="productname"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Product name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Product name"
                      {...field}
                      className=" border  border-slate-300 px-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Size name */}

            {/* Price Name */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Price"
                      {...field}
                      className=" border border-slate-300 px-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Size</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="mt-2 h-[44px] w-full border border-slate-300  text-slate-900">
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      className="h-48   overflow-auto pb-4"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {size?.map((country) => (
                        <SelectItem
                          key={country.id}
                          value={country.id.toString()}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Category Name    */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-[44px mt-2 w-full border border-slate-300  text-slate-900">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      className="h-48   overflow-auto pb-4"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {size?.map((country) => (
                        <SelectItem
                          key={country.id}
                          value={country.id.toString()}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ///IMAGE Section */}
            <FormField
              control={form.control}
              name="image"
              render={({}) => (
                <FormItem className="col-span-2">
                  <FormLabel>Choose images</FormLabel>
                  <FormControl>
                    <Input
                      id="picture"
                      name="image"
                      multiple
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={(e) => handleImage(e)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* {preview.map((prev) =>{
             <img src={imageFileUrl + user.id + imagename} alt="Preview" /> 
          })}
              */}

          <div className="mt-[6rem] flex items-center justify-center gap-4">
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

export default CreateProduct;
