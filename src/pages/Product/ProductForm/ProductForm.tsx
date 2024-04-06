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
import { Category, Product } from '@/constants/data';
import supabase from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Trash } from 'lucide-react';
import { Size } from '@/constants/data';
import { useToast } from '@/components/ui/use-toast';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent
} from '@/components/ui/select';
import { v4 as uuidv4 } from 'uuid';
import { Loader2 } from 'lucide-react';

const productFormSchema = z.object({
  productname: z.string().min(1, { message: 'product name is required' }),
  description: z.string().min(1, { message: 'description is required' }),
  size: z.string().min(1, { message: 'size is required' }),
  price: z.string().min(1, { message: 'Price is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  quantity: z.string().min(1, { message: 'quantity is required' }),
  image: z.string().optional()
});

type StudentFormSchemaType = z.infer<typeof productFormSchema>;
interface Props {
  modalClose: () => void;
  openProduct: { data: Product | object; show: boolean };
  fetchData: () => void;
}

const CreateProduct = ({ modalClose, openProduct, fetchData }: Props) => {
  const defaultValues = {
    productname: (openProduct.data as Product)?.name,
    price: ((openProduct.data as Product)?.price || 0).toString(),
    category: (openProduct.data as Product)?.category,
    size: (openProduct.data as Product)?.size,
    description: (openProduct.data as Product)?.description,
    quantity: (openProduct.data as Product)?.quantity
  };

  const form = useForm<StudentFormSchemaType>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues
  });

  const [size, setSize] = useState<Size[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [preview, setpreview] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState<boolean>(false);
  const { toast } = useToast();

  const imageFileUrl = `https://xwsfeqsmtvzdcxhmlvig.supabase.co/storage/v1/object/public/images/`;

  const fetchSize = async () => {
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
    fetchSize();
  }, []);
  const fetchCategory = async () => {
    try {
      const { data, error } = await supabase.from('Category').select('*');
      if (error) {
        return;
      }

      setCategory(data);
    } catch (error) {
      // Handle error
    } finally {
    }
  };
  useEffect(() => {
    fetchCategory();
  }, []);
  useEffect(() => {
    if (openProduct.data) {
      const imagesData = (openProduct.data as Product)?.images;
      const updatedPreview = imagesData ? JSON.parse(imagesData) : [];
      setpreview(updatedPreview);
    }
  }, [openProduct.data]);

  async function handleImage(e: React.FormEvent<HTMLInputElement>) {
    setIsUploading(true);
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };
    const files = target.files;
    const uploadedImageUrls: string[] = [];
    if (preview.length >= 4) {
      toast({
        className:
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
        title: `${'You can upload a maximum of 4 images'}`,
        variant: 'destructive'
      });
      setIsUploading(false);
      return;
    }

    for (let file of files) {
      const { data, error } = await supabase.storage
        .from('images')
        .upload(`${uuidv4()}_${file.name}`, file);

      if (error) {
        console.error('Error uploading image:', error);
      }
      uploadedImageUrls.push(data?.path as string);
      setIsUploading(false);
    }

    form.setValue('image', JSON.stringify([...preview, ...uploadedImageUrls]));
    setpreview((prevPreview) => [...prevPreview, ...uploadedImageUrls]);
  }

  const removeImage = async (index: number, imagePath: string) => {
    try {
      const updatedPreview = [...preview];
      updatedPreview.splice(index, 1);
      setpreview(updatedPreview);
      await supabase.storage.from('images').remove([imagePath]);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  const postProduct = async (values: StudentFormSchemaType) => {
    setIsCreatingProduct(true);
    const { productname, size, price, category, description, quantity } =
      values;
    const payload = {
      name: productname,
      size,
      category,
      price: parseInt(price),
      description,
      quantity: parseInt(quantity),
      images: JSON.stringify(preview)
    };

    const { error } = await supabase.from('Product').insert(payload).single();
    if (error) {
      toast({
        className:
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
        title: `${error.details || 'something wrong happened'}`,
        variant: 'destructive'
      });
    } else {
      toast({
        className:
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
        title: 'Product created successfully.',
        variant: 'default'
      });
    }
    modalClose();
    fetchData();
    setIsCreatingProduct(false);
  };

  const editProduct = async (values: StudentFormSchemaType) => {
    setIsCreatingProduct(true);
    const { productname, size, price, category, description, quantity } =
      values;
    const payload = {
      name: productname,
      size,
      category,
      price: parseInt(price),
      quantity: parseInt(quantity),
      description,
      images: JSON.stringify(preview)
    };

    const ProductId = (openProduct.data as Product)?.id;
    const { error } = await supabase
      .from('Product')
      .update(payload)
      .eq('id', ProductId);
    if (error) {
      toast({
        className:
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
        title: `${error.details || 'something wrong happened'}`,
        variant: 'destructive'
      });
    } else {
      toast({
        className:
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
        title: 'product edited successfully.',
        variant: 'default'
      });
    }
    modalClose();
    fetchData();
    setIsCreatingProduct(false);
  };
  const onSubmit = (value: StudentFormSchemaType) => {
    if ((openProduct.data as Product)?.id) {
      editProduct(value);
    } else {
      postProduct(value);
    }
  };

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
                      {size?.map((s) => (
                        <SelectItem key={s.id} value={s.name}>
                          {s.name}
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
                      {category?.map((s) => (
                        <SelectItem key={s.id} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter description"
                      {...field}
                      className=" border  border-slate-300 px-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* quantity Name */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>quantity</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0"
                      {...field}
                      className=" border border-slate-300 px-4"
                    />
                  </FormControl>
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
          {isUploading ? (
            <Loader2 className="mx-auto mt-3 flex w-[300px] animate-spin items-center justify-center" />
          ) : (
            preview.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3 p-4 shadow-md ">
                {preview.map((prev, index) => (
                  <div key={index} className="relative">
                    <Trash
                      className="absolute right-1 top-1 h-6 w-6 cursor-pointer text-red-700"
                      aria-hidden="true"
                      onClick={() => removeImage(index, prev)}
                    />
                    <img
                      src={imageFileUrl + prev}
                      alt="Preview"
                      className="h-24 w-24 rounded-md object-cover"
                    />
                  </div>
                ))}
              </div>
            )
          )}

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
            <Button
              type="submit"
              loading={isCreatingProduct}
              className="rounded-full"
              size="lg"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateProduct;
