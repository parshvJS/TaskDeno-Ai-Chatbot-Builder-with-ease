"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, Pie, PieChart, Sector, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { chatUserParams } from "@/types/types"
import { useParams } from "next/navigation"
import { LoaderPinwheel, TrendingUp } from "lucide-react"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },

} satisfies ChartConfig


const circleChartConfig = {
    monday: {
        label: "Monday",
        color: "hsl(var(--chart-1))",
    },
    tuesday: {
        label: "Tuesday",
        color: "hsl(var(--chart-2))",
    },
    wednesday: {
        label: "Wednesday",
        color: "hsl(var(--chart-3))",
    },
    thursday: {
        label: "Thursday",
        color: "hsl(var(--chart-4))",
    },
    friday: {
        label: "Friday",
        color: "hsl(var(--chart-5))",
    },
    saturday: {
        label: "Saturday",
        color: "hsl(var(--chart-1))",
    },
    sunday: {
        label: "Sunday",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig
function page() {
    const [timeRange, setTimeRange] = React.useState("90d")
    const [isUsageGraphLoading, setUsageGraphLoading] = React.useState(true)
    const [filteredData, setFilteredData] = React.useState([])
    const [averageUserStay, setAverageUserStay] = React.useState("");
    const [totalNumberOfConversations, setTotalNumberOfConversations] = React.useState("");

    const [totalNumberOfChats, setTotalNumberOfChats] = React.useState("");

    const [averageChatLength, setAverageChatLength] = React.useState("");

    const [chatUsagePerWeek, setChatUsagePerWeek] = React.useState([]);

    const { toast } = useToast()
    const params: chatUserParams = useParams();
    React.useEffect(() => {
        async function fetchUsageGraphData() {
            setUsageGraphLoading(true)
            try {
                // fetch data
                const data = await axios.post("/api/getUsageChart", {
                    projectId: params.chatbotId
                })
                console.log(data.data.data.chatUsagePerDay, "Graph data")
                setFilteredData(data.data.data.chatUsagePerDay.value)
                setAverageUserStay(`${data.data.data.averageUserStay.value}  ${data.data.data.averageUserStay.unit}`)
                setTotalNumberOfConversations(`${data.data.data.totalNumberOfConversations.value} ${data.data.data.totalNumberOfConversations.unit}`)
                setTotalNumberOfChats(`${data.data.data.totalNumberOfChats.value}  ${data.data.data.totalNumberOfChats.unit}`)
                setAverageChatLength(`${data.data.data.averageChatLength.value}  ${data.data.data.averageChatLength.unit}`)
                setChatUsagePerWeek(data.data.data.chatUsagePerWeek.value)
                console.log(data.data.data, "is hereerererer");

            } catch (e) {
                console.error(e)
                toast({
                    title: "Error",
                    description: "Failed to fetch data",
                    variant: "destructive"
                })
            } finally {
                setUsageGraphLoading(false)
            }
        }
        fetchUsageGraphData()
    }, [])
    return (
        <div className="p-4 flex flex-col gap-2">
            <Card>
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                    <div className="grid flex-1 gap-1 text-center sm:text-left">
                        <CardTitle>Chatbot Usage</CardTitle>
                        <CardDescription>
                            Showing Total Number of Chatbot Users
                        </CardDescription>
                    </div>

                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        {isUsageGraphLoading ? (
                            <div className="flex gap-2 flex-col justify-center items-center h-full w-full">
                                <LoaderPinwheel
                                    className="animate-spin"
                                />
                                <p className="font-semibold text-gray-1">Analyzing Usage Of Chatbot...</p>

                            </div>
                        ) : (
                            <AreaChart data={filteredData}>
                                <defs>
                                    <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor="var(--color-desktop)"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--color-desktop)"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                    <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor="var(--color-mobile)"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--color-mobile)"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    minTickGap={32}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent

                                            indicator="dot"
                                        />
                                    }
                                />

                                <Area
                                    dataKey="count"
                                    label={"Visitors"}
                                    type="natural"
                                    fill="url(#fillDesktop)"
                                    stroke="var(--color-desktop)"
                                    stackId="a"
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                            </AreaChart>
                        )
                        }
                    </ChartContainer>
                </CardContent>
            </Card>



            <div className="flex gap-4 w-full">
                {/* circle chart for week  */}

                <Card className="flex flex-col w-[20%] h-fit">
                    <CardHeader className="items-center pb-0">
                        <CardTitle>Traction Per Week</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                        <ChartContainer
                            config={circleChartConfig}
                            className="mx-auto aspect-square max-h-[250px]"
                        >
                            {isUsageGraphLoading ? (
                                <div className="flex gap-2 flex-col justify-center items-center h-full ">
                                    <LoaderPinwheel
                                        className="animate-spin"
                                    />
                                    <p>Loading Weekly Data</p>

                                </div>
                            ) : (
                                <PieChart>
                                    <ChartTooltip
                                        labelFormatter={(value) => {
                                            return `${value} Users`;
                                        }}
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Pie
                                        data={chatUsagePerWeek}
                                        dataKey="count"
                                        nameKey="day"
                                        innerRadius={60}
                                        strokeWidth={5}
                                        activeIndex={0}
                                        activeShape={({
                                            outerRadius = 0,
                                            ...props
                                        }: PieSectorDataItem) => (
                                            <Sector {...props} outerRadius={outerRadius + 10} />
                                        )}
                                    />
                                </PieChart>
                            )}
                        </ChartContainer>
                    </CardContent>
                    {
                        !isUsageGraphLoading && <CardFooter className="flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2 font-medium leading-none">
                                Showing total number of <br />traction per day of week<TrendingUp className="h-4 w-4" />
                            </div>

                        </CardFooter>
                    }
                </Card>

                {/* 2nd */}
                <div className="flex w-[80%] gap-4">
                    <div className="flex gap-4 flex-col h-full p-0">
                        <Card className="w-full h-1/2 flex flex-col">
                            {
                                isUsageGraphLoading ? (
                                    <div>
                                        <Skeleton className="m-4 w-72 h-[20px] rounded-full" />
                                        <Skeleton className="m-4 w-72 h-[20px] rounded-full" />
                                    </div>
                                ) : (
                                    <div>
                                        <CardHeader>
                                            <CardTitle>Avg. User Stay On Chatbot</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>{averageUserStay}</p>
                                        </CardContent>
                                    </div>
                                )
                            }

                        </Card>

                        <Card className="w-full h-1/2 flex flex-col">
                            {
                                isUsageGraphLoading ? (
                                    <div>
                                        <Skeleton className="m-4 w-44 h-[20px] rounded-full" />
                                        <Skeleton className="m-4 w-44 h-[20px] rounded-full" />
                                    </div>
                                ) : (
                                    <div>
                                        <CardHeader>
                                            <CardTitle>Total Num. Of service</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>{totalNumberOfConversations}</p>
                                        </CardContent>
                                    </div>
                                )
                            }

                        </Card>

                    </div>
                    <div className="flex gap-4 flex-col h-full p-0">
                        <Card className="w-full h-1/2 flex flex-col">
                            {
                                isUsageGraphLoading ? (
                                    <div>
                                        <Skeleton className="m-4 w-72 h-[20px] rounded-full" />
                                        <Skeleton className="m-4 w-72 h-[20px] rounded-full" />
                                    </div>
                                ) : (
                                    <div>
                                        <CardHeader>
                                            <CardTitle>Total Number Chats</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>{totalNumberOfChats}</p>
                                        </CardContent>
                                    </div>
                                )
                            }

                        </Card>

                        <Card className="w-full h-1/2 flex flex-col">
                            {
                                isUsageGraphLoading ? (
                                    <div>
                                        <Skeleton className="m-4 w-44 h-[20px] rounded-full" />
                                        <Skeleton className="m-4 w-44 h-[20px] rounded-full" />
                                    </div>
                                ) : (
                                    <div>
                                        <CardHeader>
                                            <CardTitle>Avg. Chat Length</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>{averageChatLength}</p>
                                        </CardContent>
                                    </div>
                                )
                            }

                        </Card>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default page