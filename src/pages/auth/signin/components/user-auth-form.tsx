import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from '@/routes/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import supabase from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(1, "Please enter a password"),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
const {toast} = useToast()
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  });
  const handleLogin = async (data: UserFormValue) => {
    setLoading(true)
    const {email , password} = data
    try {
      const {  error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast({
          className:
            'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
          title: `${error.message  || 'something wrong happened'}`,
          variant: 'destructive'
        });
      }
      toast({
        className:
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
        title: 'Login.',
        variant: 'default'
      });
      router.push('/');

    } catch (error) {
      console.error('Error Logging up:',);
    }
    setLoading(false)
  };
  const onSubmit = async (data: UserFormValue) => {
    handleLogin(data)

  };
  

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button loading={loading} className="ml-auto w-full mt-7" type="submit">
            Login
          </Button>
        </form>
      </Form>

    </>
  );
}
