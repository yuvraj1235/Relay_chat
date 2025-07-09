'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { useState } from "react"
import { signIn } from "next-auth/react"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router =useRouter();
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("")
  const[error,setError]=useState("")
  const handleLogin=async(e:any)=>{
    e.preventDefault();
    try {
     const res= await signIn('credentials',{
        email,
        password,
        redirect:false
      })
      if(res?.error){
        console.log("Invalid credentials");
        setError("Invalid credentials")
        return
      }
      router.replace("/dashboard")
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required onChange={(e)=>setEmail(e.target.value)}/>
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required onChange={(e)=>setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" onClick={handleLogin}>
          Login
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        
      </div>
      <div className="text-center text-sm" >
        Don&apos;t have an account?{" "}
       
        <a href="#" className="underline underline-offset-4" onClick={()=>router.push('/signin')} > 
          Sign up
        </a>
      </div>
    </form>
  )
}
