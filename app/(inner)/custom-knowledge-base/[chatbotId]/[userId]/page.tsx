'use client'
import StatusTag from '@/components/StatusTag'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { formatDate, timeAgo } from '@/lib/helper'
import { chatUserParams } from '@/types/types'
import axios from 'axios'
import { CloudUpload, FileText, LoaderPinwheel } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

function page() {
    const [files, setFiles] = useState<File[]>([])
    const [isFileUploaded, setIsFileUploaded] = useState(false)
    const [isFineTuneQueue, setIsFineTuneQueue] = useState(false)
    const [finetuneQueue, setFineTuneQueue] = useState([])
    const [isQueueEmpty, setIsQueueEmpty] = useState(false)
    const [isNewPocked, setIsNewPocked] = useState(false)
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const files = Array.from(acceptedFiles || []);
        const allowedExtensions = /(\.pdf|\.doc|\.docx|\.xls|\.xlsx|\.txt|\.csv)$/i;
        const validFiles = files.filter(file => allowedExtensions.test(file.name));

        if (validFiles.length !== files.length) {
            handleNotValidFileToast();
            acceptedFiles = []; // Clear the input
        } else {
            setFiles(validFiles)
            console.log('validFiles', validFiles)
        }
        console.log(acceptedFiles)

    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    const { toast } = useToast()
    const params: chatUserParams = useParams()
    function handleNotValidFileToast() {
        toast({
            title: 'Invalid file type',
            description: 'Please upload only PDF, DOC, DOCX, XLS, XLSX,CSV or TXT files',
            variant: 'destructive',
            duration: 5000,
        });
    }
    useEffect(() => {
        if (files.length > 0) {
            uploadFiles()
        }
    }, [files])

    useEffect(() => {
        async function getFineTuneQueue() {
            try {
                setIsFineTuneQueue(true)
                const res = await axios.post(`/api/getFineTuneQueue/`, {
                    projectId: params.chatbotId
                })
                console.log(res.data, "is finetunr data<---------->")
                if (!res.data.success || res.data.statusCode > 400) {
                    setIsQueueEmpty(true)
                }
                setFineTuneQueue(res.data.data)

            } catch (error: any) {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive',
                    duration: 5000,
                })
            } finally {
                setIsFineTuneQueue(false)
            }
        }
        getFineTuneQueue()
    }, [isNewPocked])
    async function uploadFiles() {
        console.log('files', files)
        try {
            setIsFileUploaded(true)
            const formData = new FormData()
            formData.append('projectId', params.chatbotId)
            files.forEach(file => {
                formData.append('file', file)
            })
            const res = await axios.post('/api/uploadFineTuneFiles', formData)
            console.log(res)
            toast({
                title: 'Success',
                description: 'Files uploaded successfully',
                variant: 'success',
                duration: 5000,
            })
            setIsNewPocked(!isNewPocked)
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
                duration: 5000,
            })

        } finally {
            setIsFileUploaded(false)
        }
    }

    return (
        <div className='p-4'>
            <div {...getRootProps()}>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                    {...getInputProps()}
                />
                {
                    isFileUploaded ? <div className='w-full h-48 bg-gray-200 rounded-md flex flex-col justify-center items-center border-2 border-dashed border-yellow-6 '>
                        <div className='flex justify-center items-center bg-gray-300 p-3 rounded-full'>
                            <CloudUpload />
                        </div>
                        <p className='font-semibold text-16'>Uploading...</p>
                    </div> :
                        isDragActive ?
                            <div className='w-full h-48 bg-gray-200 rounded-md flex flex-col justify-center items-center border-2 border-dashed border-gray-1'>
                                <div className='flex justify-center items-center bg-gray-300 p-3 rounded-full'>
                                    <CloudUpload />
                                </div>
                                <p className='font-semibold text-16'>Drag File Till Here ...</p>
                            </div> :
                            <div className='w-full h-48 bg-gray-200 rounded-md flex flex-col justify-center items-center border-2 border-dashed border-gray-1'>
                                <div className='flex justify-center items-center bg-gray-300 p-3 rounded-full'>
                                    <CloudUpload />
                                </div>
                                <p className='font-semibold text-14 text-gray-1'>Drag Or Click to upload Your Dataset</p>
                                <p className='font-thin text-12'>Only PDF,Docs,TXT,CSV Are valid formats</p>
                            </div>
                }
            </div>
            <div className='py-4'>
                <p className='font-bold text-24 capitalize'>Your Fine Tunes</p>

                {
                    isQueueEmpty ? (
                        <div className='flex flex-col justify-center items-center w-full'>
                            <Image
                                src='/icons/404-illu.svg'
                                alt='empty'
                                width={300}
                                height={300}
                            />
                            <p className='font-bold text-24'>No Fine Tune Process Found</p>

                        </div>
                    ) : (
                        isFineTuneQueue ? (
                            <div className='flex p-2 flex-col gap-1'>
                                <Skeleton className="w-full h-[40px] rounded-md bg-gray-100" />
                                <Skeleton className="w-full h-[40px] rounded-md bg-gray-100" />
                                <Skeleton className="w-full h-[40px] rounded-md bg-gray-100" />
                                <Skeleton className="w-full h-[40px] rounded-md bg-gray-100" />
                                <Skeleton className="w-full h-[40px] rounded-md bg-gray-100" />
                                <Skeleton className="w-full h-[40px] rounded-md bg-gray-100" />
                                <Skeleton className="w-full h-[40px] rounded-md bg-gray-100" />
                                <Skeleton className="w-full h-[40px] rounded-md bg-gray-100" />
                            </div>
                        ) : (
                            <div className='flex flex-wrap gap-1 mt-4 w-full h-full'>
                                {
                                    finetuneQueue.map((item: any, index: number) => (
                                        <div key={index} className='flex items-center justify-between bg-gray-100 p-3 rounded-md border-gray-1 gap-5 w-[49%]'>
                                            <div className='flex gap-5 mr-10   '>
                                                <FileText strokeWidth={1.5} width={22} height={22} />
                                                <p className='font-12 text-gray-500'>{item.message}</p>
                                            </div>
                                            <p className='font-semibold text-16'>
                                                <StatusTag status={item.status} />
                                            </p>
                                            <p className='font-normal'>{item.fileUrl.length} Files</p>
                                            <p className='text-gray-1 text-14'>{timeAgo(item.createdAt)}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    )
                }
            </div>
        </div>
    )
}

export default page