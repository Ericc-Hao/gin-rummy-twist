import { Button } from "@/components/ui/button"
import Link from "next/link";


import { LogInForm } from "@my-components/form/login-form";

export default function Login() {
  return (
    
    <div className="w-full h-full flex"> 
          {/* <Button asChild variant="ghost" className="w-[100px]">
        <Link href="/login">back to log in</Link>
      </Button> */}
      <div className="w-full flex flex-col items-center justify-center">
        <div> Log In </div>
        <LogInForm></LogInForm>
        <Button variant="link"><Link href="/signup" className="">Sign Up</Link></Button>
      </div>
    </div>
   
  );
}

