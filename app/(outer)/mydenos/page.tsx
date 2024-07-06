"use client";

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Label } from '@/components/ui/label';
import { CirclePlus, Loader, Loader2, Loader2Icon, LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { uuid } from 'uuidv4';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createProjectSchema } from '@/schema/createProjectSchema';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@clerk/nextjs';
import projectContext from '@/context/chatbotContext';
import { useUserProjects } from '@/tanstack/query';



const MyDeno = () => {
  const { toast } = useToast();
  const { userId } = useAuth();
  const { project, setProject } = useContext(projectContext);
  const [loading, isLoading] = useState(false);
  const router = useRouter();




  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      builder: true,
    },
  });

  async function onSubmit(values: z.infer<typeof createProjectSchema>) {
    isLoading(true);
    try {
      const res = await axios.post('/api/createProject', {
        name: values.name,
        userId: userId,
      });
      if (!res.data.success) {
        toast({
          title: "Can't create project",
        });
      }

      setProject((prevProject) => ({
        ...prevProject,
        project_name: values.name,
        project_id: res.data._id,
      }));
      

      // router.push(`/builder/${res.data.data._id}?nw=true`);
      router.push(`/dashboard`);
    } catch (error: any) {
      
      toast({
        title: "Can't create project",
        description: error.message.slice(0, 10),
      });
    } finally {
      isLoading(false);
    }
  }

  const { data: previousProjects, isLoading: projectLoading, error } = useUserProjects(userId);


  useEffect(() => {
    if (error) {
      toast({
        title: "Can't Fetch your Previous Projects!",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className='flex flex-col h-full w-full'>
      <section className='flex flex-col gap-4 w-fit mb-5'>
        <Label className='text-page-header'>My Denos</Label>

        <Dialog>
          <DialogTrigger>
            <section className='flex flex-col justify-center items-center gap-5 cursor-pointer bg-yellow-400 w-[240px] h-32 rounded-lg hover:bg-yellow-300 transition-all'>
              <div className='flex justify-center flex-col items-center gap-2'>
                <Image src={'/icons/add.svg'} width={42} height={42} alt="create new workflow" />
                <p className='text-white-1 font-bold text-16'>Create AI Workflow</p>
              </div>
            </section>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='text-24 font-semibold'>Choose Starting Point</DialogTitle>
              <DialogDescription>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Project Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="builder"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <section className='flex gap-4 w-full h-full mt-5'>
                              <div
                                className={cn(
                                  'flex flex-col justify-center items-center h-[240px] w-1/2 rounded-lg hover:bg-yellow-100 transition-all',
                                )}
                              >
                                <div className='flex gap-2 flex-col justify-center items-center cursor-pointer'>
                                  <div>
                                    <Image
                                      src={'/images/scratch.png'}
                                      width={120}
                                      height={120}
                                      alt='using scratch'
                                    />
                                    <p className='text-16 font-medium text-black text-center'>
                                      Build From Scratch
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className='flex flex-col justify-center items-center h-[240px] w-1/2 rounded-lg hover:bg-yellow-100 transition-all'>
                                <div className='flex gap-2 flex-col justify-center items-center cursor-pointer'>
                                  <Image
                                    src={'/images/useTemplate.png'}
                                    width={120}
                                    height={120}
                                    alt='using Template'
                                  />
                                  <p className='text-16 font-medium text-black text-center'>
                                    Build Using Templates
                                  </p>
                                </div>
                              </div>
                            </section>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">
                      {loading ? (
                        <div className='flex gap-2 justify-center items-center'>
                          <LoaderCircle className="animate-spin" />
                          <p>Redirecting To Builder </p>
                        </div>
                      ) : (
                        "Start Building"
                      )}
                    </Button>
                  </form>
                </Form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </section>

      <Separator />
      <section className='mt-5 flex flex-col'>
        <Label className='text-page-header'>Your Projects</Label>

        {projectLoading ? (
          <div className='flex justify-center items-center h-[240px]'>
            <Loader2 className="animate-spin" size={50} />
          </div>
        ) : (
          previousProjects == 201 ? (
            <div className='flex flex-col  justify-center items-center'>
              <Image
                src={'/images/creative.png'}
                alt='ideas'
                width={210}
                height={210}
              />
              <h1 className='font-bold text-xl '>You Dont Have Any Chatbot Right Not</h1>
            </div>
          ) :
            <div className='flex gap-4 w-full h-full mt-5 flex-wrap'>
              {previousProjects?.map((project: any, index: any) => (
                <Link key={index} href={`/builder/${project._id}?nw=false`}>
                  <section className='flex flex-col justify-center items-center gap-5 cursor-pointer w-[240px] h-32 rounded-lg bg-gray-100 border-2 border-gray-200 hover:border-gray-400 transition-all'>
                    <div className='flex justify-center flex-col items-center gap-2'>
                      <Image
                        src={'/icons/bot.svg'}
                        width={22}
                        height={22}
                        alt="create new workflow"
                        className='rounded-full bg-gray-400 w-[30px] h-[30px] p-1'
                      />
                      <p className='text-black-1 font-bold text-16'>
                        {project?.name || "AI chatbot"}
                      </p>
                    </div>
                  </section>
                </Link>
              ))}
            </div>
        )}
      </section>
    </div>
  );
};

export default MyDeno;
