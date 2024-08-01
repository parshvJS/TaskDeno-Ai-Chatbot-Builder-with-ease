"use client"

import React, { useState, useEffect } from 'react';
import {
    ColumnDef,
    flexRender,
    useReactTable,
    getCoreRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, LoaderPinwheel } from "lucide-react"
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

// Define the Payment type
export type Payment = {
    user_name: string
    user_location: string
    user_contact_no: string
}

interface DataTableProps<TData, TValue> {
    projectId: string
}

export function DataTable<TData extends Payment, TValue>({
    projectId,
}: DataTableProps<TData, TValue>) {
    const [data, setData] = useState<TData[]>([]);
    const [paginationNum, setPaginationNum] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [columns, setColumns] = useState<ColumnDef<TData, TValue>[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const { toast } = useToast();

    // Fetch data from the API
    const fetchData = async (paginationNum: number) => {
        setIsLoading(true);
        try {
            const response = await axios.post('/api/getLeadsData', {
                projectId,
                paginationNum,
            });

            const leadsData = response.data.data.data.leadsData;
            const leadsField = response.data.data.data.leadsField;
            const pagination = response.data.data.pagination;
            
            setData(leadsData);
            setColumns(leadsField.map((field: string) => ({
                accessorKey: field,
                header: field,
            })));
            setTotalPages(pagination.totalPages);

        } catch (error: any) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'Failed to fetch leads data',
                variant: "destructive"
            })
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData(paginationNum);
    }, [paginationNum]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div>
            {isLoading ?
                <div className='flex justify-center items-center mt-5'>
                    <LoaderPinwheel className="animate-spin" />
                    <p>Loading Leads...</p>
                </div> : <div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPaginationNum(prev => Math.max(prev - 1, 1))}
                            disabled={paginationNum === 1 || isLoading}
                            className="flex gap-2"
                        >
                            <ChevronLeft />
                            Previous
                        </Button>
                        <span>
                            Page {paginationNum} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPaginationNum(prev => prev + 1)}
                            disabled={paginationNum === totalPages || isLoading}
                            className="flex gap-2"
                        >
                            Next
                            <ChevronRight />
                        </Button>
                    </div>
                </div>
            }
        </div>
    )
}
