'use client'
import { Label } from '@/components/ui/label';
import { useParams } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactChatbotUi from '@/chat-template/ReactChatbotUi';
import { Axis3D, ChevronDown, ChevronUp, CloudUpload, LoaderPinwheel, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { defaultFaq } from '@/constants/constants';
import Image from 'next/image';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { set } from 'mongoose';


function page() {

  const { toast } = useToast()
  const [isPageLoading, setIsPageLoading] = useState(true)

  const params: { chatbotId: string, userId: string } = useParams()
  const projectIdParams = params.chatbotId || params.chatbotId[0];
  const defaultLargeUrl = "http://res.cloudinary.com/dkl9wgs72/image/upload/v1721543254/uefxj30fqes4uasuldzv.png";
  const defaultSmallUrl = "https://img.icons8.com/?size=100&id=7859&format=png&color=FFFFFF";
  // user controllable data
  const [marginBottom, setMarginBottom] = useState(30);
  const [marginRight, setMarginRight] = useState(30);
  const [chatbotName, setChatbotName] = useState("Task Deno | Filora")
  const [roundedTheme, setRoundedTheme] = useState(5)
  const [panelWidth, setPanelWidth] = useState(400)
  const [chatbotLargeLogo, setChatbotLargeLogo] = useState("http://res.cloudinary.com/dkl9wgs72/image/upload/v1721543254/uefxj30fqes4uasuldzv.png")
  const [chatbotSmallLogo, setChatbotSmallLogo] = useState("https://img.icons8.com/?size=100&id=7859&format=png&color=EEFF00")
  const [colorTheme, setColorTheme] = useState("#eeff00");
  const [welcomeText, setWelcomeText] = useState("Hello, How can I help you today?")
  const [faq, setFaq] = useState(defaultFaq)
  const [largeImageLoading, setLargeImageLoading] = useState(false)
  const [smallImageLoading, setSmallImageLoading] = useState(false)
  const [isSaveLoading, setIsSaveLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [isSecOpen, setIsSecOpen] = useState(false)
  const [isDeleteQueOpen, setIsDeleteQueOpen] = useState(false)
  {/* 1. faq 2.isShowSection 2.isShowQuestion 3.currentQuestion 4. currentPreviewAnswer 5.currentWholeAnswer 
                                                                  1.currentHeader   2. currentPreview 3.
                      */}
  // faq
  const [isPrevFaqShowing, setPrevFaqShowing] = useState(false)
  const [isShowingSection, setIsShowingSection] = useState(false);
  const [isShowingQuestion, setIsShowingQuestion] = useState(false);
  // section state
  const [activeSection, setActiveSection] = useState(-1)
  const [currentHeader, setCurrentHeader] = useState("")
  const [currentPreview, setCurrentPreview] = useState("")
  //question state
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [currentPreviewAnswer, setCurrentPreviewAnswer] = useState("")
  const [currentWholeAnswer, setCurrentWholeAnswer] = useState("")
  const [currentQna, setCurrentQna] = useState(-1)
  const [currentDelQna, setCurrentDelQna] = useState(-1)
  const [currentDelSec, setCurrentDelSec] = useState(-1)

  // upload large logo
  const onLargeFileUpload = useCallback(async (acceptedFiles: FileWithPath[]) => {
    setLargeImageLoading(true)
    const file = acceptedFiles[0] || acceptedFiles;
    const form = new FormData();
    form.append('file', file);
    const res = await axios.post('/api/upload-image', form)
    const url = res.data.data;
    setChatbotLargeLogo(url!);
    setLargeImageLoading(false)
  }, []);

  // upload small logo
  const onSmallFileUpload = useCallback(async (acceptedFiles: FileWithPath[]) => {
    setSmallImageLoading(true)
    const file = acceptedFiles[0] || acceptedFiles;
    const form = new FormData();
    form.append('file', file);
    const res = await axios.post('/api/upload-image', form)
    const url = res.data.data;
    setChatbotSmallLogo(url!);
    setSmallImageLoading(false)
  }, []);

  const {
    getRootProps: getLargeFileRootProps,
    getInputProps: getLargeFileInputProps,
    isDragActive: isLargeFileDragActive,
  } = useDropzone({ onDrop: onLargeFileUpload });

  const {
    getRootProps: getSmallFileRootProps,
    getInputProps: getSmallFileInputProps,
    isDragActive: isSmallFileDragActive,
  } = useDropzone({ onDrop: onSmallFileUpload });

  //set previous value on load
  useEffect(() => {
    async function fetchPreviousStyle() {
      try {
        if (!projectIdParams) {
          return;
        }

        const res = await axios.post('/api/getPreviousChatbotUi', {
          projectId: projectIdParams
        })

        if (res.data.statuscode > 200) {
          return;
        }

        const cookedRes = res.data?.data;
        console.log(cookedRes, "is lollllllllllllllllllllllll");

        // setting values
        setMarginBottom(cookedRes.marginBottom)
        setMarginRight(cookedRes.marginRight)
        setChatbotName(cookedRes.chatbotName)
        setRoundedTheme(cookedRes.roundedTheme)
        setPanelWidth(cookedRes.panelWidth)
        setChatbotLargeLogo(cookedRes.chatbotLargeLogo)
        setChatbotSmallLogo(cookedRes.chatbotSmallLogo)
        setColorTheme(cookedRes.colorTheme)
        setWelcomeText(cookedRes.welcomText)
        setFaq(cookedRes.faq)

      } catch (error: any) {
        toast({
          title: "Can't Load Your Data!",
          description: error.message,
          variant: "destructive"
        })
      } finally {
        setIsPageLoading(false)
      }
    }
    fetchPreviousStyle()
  }, [])

  async function handleSave(e: any) {
    e.preventDefault()
    try {
      setIsSaveLoading(true)
      console.log(marginBottom,
        marginRight,
        chatbotName,
        roundedTheme,
        panelWidth,
        chatbotLargeLogo,
        chatbotSmallLogo,
        colorTheme,
        welcomeText,
        faq, "ius herekkfjldkfjsldkfjsdlkfjslfjsdlfks");

      const res = await axios.post('/api/saveChatbotUiChanges', {
        projectId: projectIdParams,
        marginBottom,
        marginRight,
        chatbotName,
        roundedTheme,
        panelWidth,
        chatbotLargeLogo,
        chatbotSmallLogo,
        colorTheme,
        welcomText: welcomeText,
        faq
      })

      if (res.data.statuscode > 200) {
        toast({
          title: "Can't Save Your Data!",
          description: res.data.message,
          variant: "destructive"
        })
        return;
      }

      toast({
        title: "Data Saved Successfully!",
        description: "Your data has been saved successfully.",
        variant: "success"
      })
      console.log(res.data);
    } catch (error: any) {
      toast({
        title: "Can't Save Your Data!",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsSaveLoading(false)
    }
  }



  // forms 
  const contentSchema = z.object({
    chatbotName: z.string().min(3, "Name must be atleast 3 characters long").max(20, "Name must be atmost 20 characters long"),
    welcomeText: z.string().min(3, "Welcome text must be atleast 3 characters long").max(35, "Welcome text must be atmost 35 characters long")
  })

  const contentForm = useForm<z.infer<typeof contentSchema>>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      chatbotName: "Task Deno | Filora",
      welcomeText: "Hello, How can I help you today?"
    },
  })

  useEffect(() => {
    // Step 1: Clone the FAQ array
    const updatedFaq = [...faq];

    // Step 2: Update the specific section directly
    if (updatedFaq[activeSection]) {
      updatedFaq[activeSection].header = currentHeader;
      updatedFaq[activeSection].preview = currentPreview;
    }

    // Step 3: Set the updated array to state
    setFaq(updatedFaq);
  }, [currentHeader, currentPreview]);

  useEffect(() => {
    setCurrentQuestion(faq[activeSection]?.qna[currentQna]?.question)
    setCurrentPreviewAnswer(faq[activeSection]?.qna[currentQna]?.previewAnswer)
    setCurrentWholeAnswer(faq[activeSection]?.qna[currentQna]?.wholeAnswer)

  }, [currentQna])

  useEffect(() => {

    if (currentQna > -1) {
      // Step 1: Clone the FAQ array
      const updatedFaq = [...faq];

      // Step 2: Update the specific question directly
      if (updatedFaq[activeSection]?.qna[currentQna]) {
        updatedFaq[activeSection].qna[currentQna].question = currentQuestion;
        updatedFaq[activeSection].qna[currentQna].previewAnswer = currentPreviewAnswer;
        updatedFaq[activeSection].qna[currentQna].wholeAnswer = currentWholeAnswer;
      }

      // Step 3: Set the updated array to state
      setFaq(updatedFaq);
    }
  }, [currentQuestion, currentPreviewAnswer, currentWholeAnswer])

  function handleAddSection(e:FormEvent) {
    e.preventDefault()
    if (currentHeader.length < 1 || currentPreview.length < 1) {
      toast({
        title: "Can't Add Section!",
        description: "All fields are required to add a section.",
        variant: "destructive"
      })
      return;
    }
    // Step 1: Clone the FAQ array
    const updatedFaq = [...faq];

    // Step 2: Update the specific section directly
    updatedFaq.push({
      header: currentHeader,
      preview: currentPreview,
      qna: []
    })

    // Step 3: Set the updated array to state
    setFaq(updatedFaq);
    setIsShowingSection(false)
    // Step 4: Clear the input fields
    setCurrentHeader("");
    setCurrentPreview("");
    toast({
      title: "Section Added",
      description: "The section has been successfully added.",
      variant: "success"
    });
  }

  function handleDeleteSection(e:FormEvent) {
    e.preventDefault()
    // Step 1: Clone the FAQ array
    const updatedFaq = [...faq];

    // Step 2: Update the specific section directly
    updatedFaq.splice(currentDelSec, 1)

    // Step 3: Set the updated array to state
    setFaq(updatedFaq);
    // Step 4: Clear the input fields
    setCurrentHeader("");
    setCurrentPreview("");
    toast({
      title: "Section Deleted",
      description: "The section has been successfully deleted.",
      variant: "success"
    });
    setIsSecOpen(!isSecOpen)
  }

  function addNewQuestion(e:FormEvent) {
    e.preventDefault()
    if (currentQuestion.length < 1 || currentPreviewAnswer.length < 1 || currentWholeAnswer.length < 1) {
      toast({
        title: "Can't Add Question!",
        description: "All fields are required to add a question.",
        variant: "destructive"
      })
      return;
    }
    // Step 1: Clone the FAQ array
    const updatedFaq = [...faq];

    // Step 2: Update the specific question directly
    if (updatedFaq[activeSection]) {
      updatedFaq[activeSection].qna.push({
        question: currentQuestion,
        previewAnswer: currentPreviewAnswer,
        wholeAnswer: currentWholeAnswer
      })
    }

    // Step 3: Set the updated array to state
    setFaq(updatedFaq);
    setIsShowingQuestion(false)
    // Step 4: Clear the input fields
    setCurrentQuestion("");
    setCurrentPreviewAnswer("");
    setCurrentWholeAnswer("");
    toast({
      title: "Question Added",
      description: "The question has been successfully added.",
      variant: "success"
    });
  }

  function handleDeleteQuestion(e: any) {
    e.preventDefault()
    // Step 1: Clone the FAQ array
    const updatedFaq = [...faq];

    // Step 2: Update the specific question directly
    if (updatedFaq[activeSection]) {
      updatedFaq[activeSection].qna.splice(currentDelQna, 1)
    }

    // Step 3: Set the updated array to state
    setFaq(updatedFaq);
    // Step 4: Clear the input fields
    setCurrentQuestion("");
    setCurrentPreviewAnswer("");
    setCurrentWholeAnswer("");
    toast({
      title: "Question Deleted",
      description: "The question has been successfully deleted.",
      variant: "success"
    });
    setIsDeleteQueOpen(!isDeleteQueOpen)
  }
  // js boundry
  if (isPageLoading) {
    return <div className='flex flex-col h-[96%] w-full mx-10 my-5 '>
      {/* <section className='flex flex-col gap-4 w-fit mb-5'>
        <Label className='text-page-header'>Customize Appearence & Theme</Label>
      </section> */}

      <section className='w-full h-full flex rounded-md slim-border'>
        <div className='w-[50%] h-full p-5'>

          <div className=' w-full h-full flex justify-center items-center flex-col'>
            <LoaderPinwheel width={30} height={30} className='animate-spin text-gray-600' />
            <p className='text-16  font-semibold text-gray-600'>Mounting Styles that Converts!</p>
          </div>
        </div>
        <div className='w-[50%] h-full bg-gray-100 p-4'>
          <div className='w-full h-full flex justify-center items-center flex-col'>
            <LoaderPinwheel width={30} height={30} className='animate-spin text-gray-600' />
            <p className='text-16  font-semibold text-gray-600'>Managing Chatbot Beauty!</p>
          </div>
        </div>

      </section>
    </div>
  }



  return (
    <div className='mx-10 my-5 flex flex-col h-[96%] w-full' >
      {/* <section className='flex flex-col gap-4 w-fit mb-5'>
        <Label className='text-page-header'>Customize Appearence & Theme</Label>
      </section> */}

      <section className='w-full h-full flex rounded-md slim-border'>
        <div className='w-[50%] h-full p-5'>
          <section className='flex flex-col gap-4 w-fit mb-5'>
            <Label className='text-18 '>Customize Chatbot Appearence To Users</Label>
          </section>


          <Tabs defaultValue="size">
            <TabsList className='bg-yellow-4 w-[215px]' >
              <TabsTrigger value="size" className='text-black'>Size</TabsTrigger>
              <TabsTrigger value="brand" className='text-black'>Branding</TabsTrigger>
              <TabsTrigger value="content" className='text-black'>Content</TabsTrigger>
            </TabsList>

            <TabsContent value="size">
              {/* margin,panel width,rounded, */}

              <div className='flex gap-2 flex-col'>
                <p className='font-semibold text-16'>Margin Bottom</p>
                <input
                  min={30}
                  max={80}
                  type="number"
                  value={marginBottom}
                  onChange={(e) => setMarginBottom(parseInt(e.target.value))}
                  className='border-2 border-gray-400 p-2 rounded-md'
                />
              </div>
              <div className='flex gap-2 flex-col mt-5'>
                <p className='font-semibold text-16'>Margin Right</p>
                <input
                  min={30}
                  max={120}
                  type="number"
                  value={marginRight}
                  onChange={(e) => setMarginRight(parseInt(e.target.value))}
                  className='border-2 border-gray-400 p-2 rounded-md'
                />
              </div>
              <div className='flex gap-2 flex-col mt-5'>
                <p className='font-semibold text-16'>Panel Width</p>
                <input
                  min={400}
                  max={800}
                  type="number"
                  value={panelWidth}
                  onChange={(e) => setPanelWidth(parseInt(e.target.value))}
                  className='border-2 border-gray-400 p-2 rounded-md'
                />
              </div>
              <div className='flex gap-2 flex-col mt-5'>
                <p className='font-semibold text-16'>Button Circular </p>
                <input
                  max={30}
                  type="number"
                  value={roundedTheme}
                  onChange={(e) => setRoundedTheme(parseInt(e.target.value))}
                  className='border-2 border-gray-400 p-2 rounded-md'
                />
              </div>
              <Button onClick={handleSave} className='text-black hover:bg-yellow-2 w-full mt-3'>
                {
                  isSaveLoading ? <div className='flex gap-2'>
                    <LoaderPinwheel width={20} height={20} className='animate-spin text-black' />
                    <p>Saving Changes</p>
                  </div> : <p>Save</p>
                }
              </Button>
            </TabsContent>

            <TabsContent value="brand" className='mt-5 flex flex-col gap-2 justify-between' >
              <div className='w-full flex gap-2'>
                <div className='w-1/2 flex flex-col gap-2'>
                  <p className='font-semibold text-16 ' >Upload Large Logo</p>
                  <div {...getLargeFileRootProps()} className="dropzone">
                    <input {...getLargeFileInputProps()} accept='image/*' />
                    {
                      isLargeFileDragActive ?
                        <div className='w-full h-48 bg-gray-200 rounded-md flex flex-col justify-center items-center border-2 border-dashed border-gray-1'>
                          <div className='flex justify-center items-center bg-gray-300 p-3 rounded-full'>
                            <CloudUpload />
                          </div>
                          <p className='font-semibold text-16'>Drag File Till Here ...</p>
                        </div> :

                        largeImageLoading ? <div className='w-full h-48 bg-gray-200 rounded-md flex flex-col justify-center items-center border-2 border-dashed border-yellow-6 '>
                          <div className='flex justify-center items-center bg-gray-300 p-3 rounded-full'>
                            <CloudUpload />
                          </div>
                          <p className='font-semibold text-16'>Uploading...</p>
                        </div> : <div className='w-full h-48 bg-gray-200 rounded-md flex flex-col justify-center items-center gap-4'>
                          <div className='flex justify-center items-center bg-gray-500 p-3 rounded-full'>
                            <CloudUpload />
                          </div>
                          <p className='font-semibold text-14 text-gray-1'>Drag Or Upload Large Logo Of Your Brand</p>
                        </div>


                    }
                  </div>
                </div>


                <div className='w-1/2 flex flex-col gap-2'>
                  <p className='font-semibold text-16 ' >Upload Small Logo</p>
                  <div {...getSmallFileRootProps()} className="dropzone">
                    <input {...getSmallFileInputProps()} accept='image/*' />
                    {
                      isSmallFileDragActive ?
                        <div className='w-full h-48 bg-gray-200 rounded-md flex flex-col justify-center items-center border-2 border-dashed border-gray-1'>
                          <div className='flex justify-center items-center bg-gray-300 p-3 rounded-full'>
                            <CloudUpload />
                          </div>
                          <p className='font-semibold text-16'>Drag File Till Here ...</p>
                        </div> :

                        smallImageLoading ? <div className='w-full h-48 bg-gray-200 rounded-md flex flex-col justify-center items-center border-2 border-dashed border-yellow-6 '>
                          <div className='flex justify-center items-center bg-gray-300 p-3 rounded-full'>
                            <CloudUpload />
                          </div>
                          <p className='font-semibold text-16'>Uploading...</p>
                        </div> : <div className='w-full h-48 bg-gray-200 rounded-md flex flex-col justify-center items-center gap-4'>
                          <div className='flex justify-center items-center bg-gray-500 p-3 rounded-full'>
                            <CloudUpload />
                          </div>
                          <p className='font-semibold text-14 text-gray-1'>Drag Or Upload Small Logo Of Your Brand</p>
                        </div>


                    }
                  </div>
                </div>
              </div>


              {
                (chatbotLargeLogo != defaultLargeUrl || chatbotSmallLogo != defaultSmallUrl) &&
                (chatbotLargeLogo && chatbotSmallLogo) &&
                <div className='w-full flex gap-2'>
                  <div className='w-1/2 rounded-md'>
                    <p className='font-semibold text-16'>Current Large Logo</p>
                    <Image src={chatbotLargeLogo} width={100} height={100} alt='logo large' className='min-w-full bg-gray-300 p-2 max-h-[100px] rounded-md' />
                  </div>
                  <div className='w-1/2 rounded-md'>
                    <p className='font-semibold text-16'>Current Small Logo</p>
                    <Image src={chatbotSmallLogo} width={100} height={100} alt='logo small' className='bg-gray-300 p-4 min-w-fit max-h-[100px] rounded-md' />
                  </div>
                </div>
              }

              <div className='flex gap-2'>
                <p className='font-semibold text-16'>Select Color Theme</p>
                <input
                  type="color"
                  value={colorTheme}
                  onChange={(e) => setColorTheme(e.target.value)}
                />

              </div>
              <Button onClick={handleSave} className='text-black hover:bg-yellow-2'>
                {
                  isSaveLoading ? <div className='flex gap-2'>
                    <LoaderPinwheel width={20} height={20} className='animate-spin text-black' />
                    <p>Saving Changes</p>
                  </div> : <p>Save</p>
                }
              </Button>
            </TabsContent>

            <TabsContent value="content" className='flex flex-col gap-3'>
              <Label className='text-14 mt-4'>Chatbot Name</Label>
              <Input
                placeholder="Enter Chatbot Name"
                defaultValue={chatbotName}
                value={chatbotName}
                onChange={(e) => setChatbotName(e.target.value)}
              />
              {/* welcome text */}
              {/* adding mordern label */}
              <Label className='text-14 mt-4'>Welcome Text</Label>
              <Input
                placeholder="Enter Welcome Text"
                defaultValue={welcomeText}
                value={welcomeText}
                onChange={(e) => setWelcomeText(e.target.value)}
              />
              <Label className='text-14 mt-4'>Edit Frequenctly Asked Question</Label>

              <Sheet >
                <SheetTrigger>
                  <div className='border border-gray-300 hover:bg-gray-300 p-2 rounded-md transition-all text-14 '>
                    Add FAQs
                  </div>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Add Frequencly Asked Question</SheetTitle>
                    <SheetDescription className='w-full flex flex-col gap-5'>

                      <div className='w-full'>
                        {/* add new section */}
                        <Button
                          onClick={() => setIsShowingSection(!isShowingSection)}
                          variant={"ghost"}
                          className='bg-gray-300 w-full flex justify-between items-center p-2'
                        >
                          Add New FAQ Section
                        </Button>
                        {
                          isShowingSection && <div className='my-5 flex gap-2 flex-col p-3 bg-gray-100 border-2 border-gray-300 rounded-md'>
                            <Label className='font-semibold text-14'>Add New Section</Label>
                            <Input
                              value={currentHeader}
                              onChange={(e) => setCurrentHeader(e.target.value)}
                            />
                            <Label className='font-semibold text-14'>Add Preview</Label>
                            <Input
                              value={currentPreview}
                              onChange={(e) => setCurrentPreview(e.target.value)}
                            />
                            <Button onClick={handleAddSection} variant={"ghost"} className='w-full bg-gray-400 text-black'>Save Section</Button>
                          </div>
                        }

                      </div>

                      <div className="w-full">
                        <Button
                          onClick={() => setPrevFaqShowing(!isPrevFaqShowing)}
                          variant={"ghost"}
                          className='bg-gray-300 w-full flex justify-between items-center p-2'
                        >
                          Expand Faq's
                          {isPrevFaqShowing ? <ChevronUp /> : <ChevronDown />}
                        </Button>

                        {isPrevFaqShowing && (
                          <ScrollArea className='w-full h-full flex flex-col gap-4'>
                            {faq.map((section, index) => (
                              <div
                                key={index}
                                className={`w-full h-fit rounded-md border border-gray-300 p-2 mt-2 transition-transform duration-500 ease-out transform ${isPrevFaqShowing ? `translate-y-${index * 10}` : 'translate-y-0'
                                  }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                              >
                                <div className='font-semibold flex flex-col gap-2 text-black'>
                                  <p>{section.header}</p>
                                  <p>{section.preview}</p>
                                  <div className='flex gap-2 w-full justify-between'>
                                    <p className='font-thin text-gray-500'>{section.qna.length} Articles</p>
                                    <Dialog open={isSecOpen} onOpenChange={setIsSecOpen}>
                                      <DialogTrigger>
                                        {/* delete button */}
                                        <button
                                          onClick={() => setCurrentDelSec(index)}
                                          className='text-black hover:text-white-1 p-2 rounded-md flex gap-2 items-center hover:bg-red-400'>
                                          <Trash2 width={15} height={15} />
                                          Delete
                                        </button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                                          <DialogDescription className='flex flex-col gap-2'>
                                            <p className='mt-5'>After Deleting You Question Wouldn't appear on chatbot</p>
                                            <p className='mt-2'>All Related Data will be deleted</p>
                                            <Button onClick={handleDeleteSection} variant={"destructive"} className='flex justify-center items-center gap-2 p-1'>
                                              <Trash2 width={15} height={15} />
                                              Delete
                                            </Button>
                                          </DialogDescription>
                                        </DialogHeader>
                                      </DialogContent>
                                    </Dialog>

                                    <Sheet>
                                      <SheetTrigger>
                                        <div className='rounded-md hover:bg-gray-300 p-2 px-1' onClick={() => setActiveSection(index)}>
                                          Edit Sections & QA
                                        </div>
                                      </SheetTrigger>
                                      <SheetContent>
                                        <Button onClick={() => setIsShowingQuestion(!isShowingQuestion)} variant={"ghost"} className='my-3 w-full bg-gray-300 text-black'>
                                          Add New Question
                                        </Button>
                                        {
                                          isShowingQuestion && <div className='my-5 flex gap-2 flex-col p-3 bg-gray-100 border-2 border-gray-300 rounded-md'>
                                            <Label className='font-semibold text-14'>Add New Question</Label>
                                            <Input
                                              value={currentQuestion}
                                              onChange={(e) => setCurrentQuestion(e.target.value)}
                                            />
                                            <Label className='font-semibold text-14'>Add Preview Answer</Label>
                                            <Input
                                              value={currentPreviewAnswer}
                                              onChange={(e) => setCurrentPreviewAnswer(e.target.value)}
                                            />
                                            <Label className='font-semibold text-14'>Add Whole Answer</Label>
                                            <Input
                                              value={currentWholeAnswer}
                                              onChange={(e) => setCurrentWholeAnswer(e.target.value)}
                                            />
                                            <Button onClick={addNewQuestion} variant={"ghost"} className='w-full bg-gray-400 text-black'>Save Question</Button>
                                          </div>
                                        }
                                        <Label className='font-semibold text-14'>Change Header</Label>
                                        <Input
                                          defaultValue={faq[activeSection]?.header}
                                          onChange={(e) => setCurrentHeader(e.target.value)} />
                                        <Label className='font-semibold text-14'>Change Preview</Label>
                                        <Input
                                          defaultValue={faq[activeSection]?.preview}
                                          onChange={(e) => setCurrentPreview(e.target.value)} />
                                        <Label className='font-semibold text-14'>Section Questions</Label>
                                        {
                                          faq[activeSection]?.qna?.map((qa, index) => {
                                            return (
                                              <div className='flex flex-col gap-2 mt-2 rounded-md border-2 border-gray-1 p-2'>
                                                <p className='font-semibold text-black'>{qa.question}</p>
                                                <p className='text-gray-1 font-medium'>{qa.previewAnswer}</p>

                                                <div className='flex gap-2'>
                                                  <Dialog open={open} onOpenChange={setOpen}>
                                                    <DialogTrigger>
                                                      <button onClick={() => setCurrentQna(index)} className='hover:bg-gray-300 rounded-md text-black flex justify-center items-center gap-2 w-fit p-1'>
                                                        <Pencil width={15} height={15} />
                                                        Edit
                                                      </button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                      <DialogHeader>
                                                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                        <DialogDescription className='flex flex-col gap-3'>
                                                          <Label>Question</Label>
                                                          <Input
                                                            defaultValue={faq[activeSection]?.qna[currentQna]?.question}
                                                            value={currentQuestion}
                                                            onChange={(e) => setCurrentQuestion(e.target.value)}
                                                          />
                                                          <Label>Preview Answer</Label>
                                                          <Input
                                                            defaultValue={faq[activeSection]?.qna[currentQna]?.previewAnswer}
                                                            value={currentPreviewAnswer}
                                                            onChange={(e) => setCurrentPreviewAnswer(e.target.value)}
                                                          />
                                                          <Label>Whole Answer</Label>
                                                          <Input
                                                            defaultValue={faq[activeSection]?.qna[currentQna]?.wholeAnswer}
                                                            value={currentWholeAnswer}
                                                            onChange={(e) => setCurrentWholeAnswer(e.target.value)}
                                                          />
                                                          <Button variant={"ghost"} className='bg-gray-400 text-black' onClick={() => setOpen(false)}>Save Question</Button>
                                                        </DialogDescription>
                                                      </DialogHeader>
                                                    </DialogContent>
                                                  </Dialog>

                                                  {/* delete */}
                                                  <Dialog open={isDeleteQueOpen} onOpenChange={setIsDeleteQueOpen}>
                                                    <DialogTrigger>
                                                      <button onClick={() => setCurrentDelQna(index)} className='text-red-600 hover:bg-gray-300 rounded- flex justify-center items-center gap-2 w-fit p-1'>
                                                        <Trash2 width={15} height={15} />
                                                        Delete
                                                      </button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                      <DialogHeader className='flex gap-2 h-full'>
                                                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                        <DialogDescription className='flex flex-col gap-2'>
                                                          <p className='mt-5'>After Deleting You Question Wouldn't appear on chatbot</p>
                                                          <p className='mt-2'>All Related Data will be deleted</p>
                                                          <Button onClick={handleDeleteQuestion} variant={"destructive"} className='flex justify-center items-center gap-2 p-1'>
                                                            <Trash2 width={15} height={15} />
                                                            Delete
                                                          </Button>
                                                        </DialogDescription>
                                                      </DialogHeader>
                                                    </DialogContent>
                                                  </Dialog>
                                                </div>

                                              </div>
                                            )
                                          })}

                                      </SheetContent>
                                    </Sheet>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </ScrollArea>
                        )}

                      </div>




                      {/* add new section - add new question   */}
                      {/* 1. section cant be empty  2. section must have 1 question in it */}
                      {/* ds : 
                        [
                          {
                            id:1,
                            header:"sfsd",
                            preview:"sdfsdf",
                            questions:[
                              question:
                              preview:
                              wholeAnswer:
                              ]
                          }
                        ]
                      */}

                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
              <Button onClick={handleSave} className='text-black hover:bg-yellow-2 w-full mt-3'>
                {
                  isSaveLoading ? <div className='flex gap-2'>
                    <LoaderPinwheel width={20} height={20} className='animate-spin text-black' />
                    <p>Saving Changes</p>
                  </div> : <p>Save</p>
                }
              </Button>
            </TabsContent>
          </Tabs>


        </div>
        <div className='w-[50%] h-full bg-gray-100 p-4'>
          <section className='flex flex-col gap-4 w-fit mb-2'>
            <Label className='text-18 '>Preview Design</Label>
          </section>
          <div className='w-full h-full'>

            <ReactChatbotUi
              project={{
                panelWidth: panelWidth || 400,
                starterMessage: welcomeText || "Hello, How can I help you today?",
                colorTheme: colorTheme || "#eeff00",
                marginBottom: marginBottom || 30,
                marginRight: marginRight || 30,
                userChatbotName: chatbotName || "Task Deno | Filora",
                userChatbotImage: chatbotLargeLogo || "http://res.cloudinary.com/dkl9wgs72/image/upload/v1721543254/uefxj30fqes4uasuldzv.png",
                userChatbotLogo: chatbotSmallLogo || "https://img.icons8.com/?size=100&id=7859&format=png&color=FFFFFF",
                borderRadius: roundedTheme || 10,
                welcomeText: welcomeText || "Hello, How can I help you today?",
                faq: faq || defaultFaq,
              }}
            />
          </div>

        </div>
        {/* design */}

      </section>
    </div>
  )
}

export default page 