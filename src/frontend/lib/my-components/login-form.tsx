"use client"

import { signIn } from "next-auth/react"
// import { useSearchParams } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {useDispatch } from 'react-redux';
import {  setUserInfo } from '@shared-store/slices/user';
import { AppDispatch } from '@shared-store/index'; 
// import { useEffect } from 'react';

import { useRouter } from "next/navigation"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string()
})

export function LogInForm() {

  const router = useRouter();
  
  const dispatch = useDispatch<AppDispatch>();
  // const user = useSelector((state: RootState) => state.user);
  // useEffect(() => {
  //   console.log("Updated user info: ", user);
  // }, [user]);

  const onLogin = async (data: z.infer<typeof formSchema>) => {
    const result = await signIn("credentials", {
      email: data.username,
      password: data.password,
      redirect: false, // 使用 false 以避免自动重定向
    });
    
    console.log("login result: ", result);
    
    // 检查登录是否成功
    if (result?.error) {
      console.error("Login failed: ", result.error);
      return; // 登录失败时不做任何事情
    }

    // 登录成功时将数据存储到 Redux store
    dispatch(setUserInfo({ username: data.username })); // 传递 username
    console.log("User info dispatched: ", { username: data.username });
    router.push("/home");

    // // 如果有 callbackUrl，重定向到该 URL
    // if (result?.url) {
    //   window.location.href = result.url; // 或者使用 router.push() 方法
    // }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onLogin)} className="w-[500px] flex flex-col gap-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} className="w-full" />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} className="w-full"  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">LogIn</Button>
      </form>
    </Form>
  )
}