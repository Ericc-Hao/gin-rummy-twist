"use client";

import { HeaderBar } from '@/lib/my-components/header-bar';


export default function pvp() {
  return (
    <div className='w-full '>
                <HeaderBar></HeaderBar>
    
        {/* <div className="w-full h-full flex">  */}
        <div className="w-full pt-[100px] flex flex-col items-center justify-center">
            <CardWithForm></CardWithForm>
        </div>
        {/* </div> */}
    </div>
  );
}


import * as React from "react"
import { useState,useEffect, useRef } from 'react';


import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CardWithForm() {


    const [isCreatingNewRoom, setIsCreatingNewRoom] = useState(false);

    useEffect(() => {
        console.log(isCreatingNewRoom);
    })    

    function handleSwitch(){
        setIsCreatingNewRoom(!isCreatingNewRoom)
    }
    
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Join a room </CardTitle>
                <CardDescription>Switch to create a new room if you want to create a new one.</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                <div className="grid w-full items-center gap-4">
                <div className="flex items-center space-x-2">
                <Switch id="isCreatingNewRoom" 
                     />
                <Label htmlFor="isCreatingNewRoom">Create a new room</Label>
            </div>

                <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Room NO.</Label>
                <Input id="number" placeholder="enter number" />
                </div>
            </div>
            </form>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Join</Button>
        </CardFooter>
        </Card>
    )
}
