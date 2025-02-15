"use client";

import { HeaderBar } from '@/lib/my-components/header-bar';


export default function pvp() {
  return (
    <div className='w-full '>
                <HeaderBar></HeaderBar>
    
        {/* <div className="w-full h-full flex">  */}
        <div className="w-full pt-[100px] flex flex-col items-center justify-center">
            <PVP></PVP>
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

export function PVP() {
    const [isCreatingNewRoom, setIsCreatingNewRoom] = useState(false);

    const [currentTitle, setCurrentTitle] = useState('Join a Room')
    const [currentButton, setCurrenButton] = useState('Join')


    useEffect(() => {
        console.log(isCreatingNewRoom);
        if (isCreatingNewRoom) {
            setCurrentTitle('Create a Room')
            setCurrenButton('Create')
        } else{
            setCurrentTitle('Join a Room')
            setCurrenButton('Join')

        }
    }, [isCreatingNewRoom]); 

    function handleButton(){
        // if (isCreatingNewRoom) {
        //     alert('Create')
        // } else{
        //     alert('Join')
        // }
    }

    function handleSwitch(checked: boolean) {
        setIsCreatingNewRoom(checked);
    }
    
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>{currentTitle}</CardTitle>
                <CardDescription>Switch to create if you are the holder.</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isCreatingNewRoom"
                                checked={isCreatingNewRoom} 
                                onCheckedChange={handleSwitch} 
                            />
                            <Label htmlFor="isCreatingNewRoom">Create</Label>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="number">Room NO.</Label>
                            <Input id="number" placeholder="Enter number" />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant={'outline'}>Back</Button>
                <Button onClick={handleButton}>{currentButton}</Button>
            </CardFooter>
        </Card>
    );
}

