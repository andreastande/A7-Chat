"use client"

import { authClient } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeClosed } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"

const formSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(1, "Please enter a name"),
  email: z.string({ required_error: "Email is required" }).email("Please enter a valid email address"),
  password: z.string({ required_error: "Password is required" }).min(8, "Password must be at least 8 characters long"),
})

export default function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const router = useRouter()

  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      if (result.error) {
        setError(result.error.message ?? "Signup failed")
      } else {
        router.push("/")
      }
    } catch {
      setError("Unexpected error occured")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-80">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" type="text" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" autoComplete="email" {...field} />
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
                <div className="relative">
                  <Input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="pr-10"
                    {...field}
                  />
                  {field.value.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 size-7 cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <Eye /> : <EyeClosed />}
                    </Button>
                  )}
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button type="submit" className="text-white w-full cursor-pointer">
          Continue
        </Button>
      </form>
    </Form>
  )
}
