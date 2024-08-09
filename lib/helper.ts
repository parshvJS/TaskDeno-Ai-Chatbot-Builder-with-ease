import { ChatDocument } from "@/types/types";
import { addDays, subDays } from "date-fns";
import { unlinkSync, writeFile } from "fs";
import { Document } from "mongoose";
import { join } from "path";
import { ChatbotInstance } from "taskdeno-mongoose-model";
import { uploadOnCloudinary } from "./uploadOnCloudinary";

export function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (secondsAgo < 60) {
        return `${secondsAgo} second${secondsAgo !== 1 ? 's' : ''} ago`;
    } else if (secondsAgo < 3600) {
        const minutesAgo = Math.floor(secondsAgo / 60);
        return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
    } else if (secondsAgo < 86400) {
        const hoursAgo = Math.floor(secondsAgo / 3600);
        return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
    } else if (secondsAgo < 2592000) {
        const daysAgo = Math.floor(secondsAgo / 86400);
        return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
    } else if (secondsAgo < 31536000) {
        const monthsAgo = Math.floor(secondsAgo / 2592000);
        return `${monthsAgo} month${monthsAgo !== 1 ? 's' : ''} ago`;
    } else {
        const yearsAgo = Math.floor(secondsAgo / 31536000);
        return `${yearsAgo} year${yearsAgo !== 1 ? 's' : ''} ago`;
    }
}


export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function countDocumentsByDate(documents: ChatDocument[]): { date: string, count: number }[] {
    const dateCounts: Record<string, number> = {}; // Use Record<string, number> for the object type

    documents.forEach(doc => {
        const date = doc.createdAt.toISOString().split('T')[0];
        if (dateCounts[date]) {
            dateCounts[date]++;
        } else {
            dateCounts[date] = 1;
        }
    });

    const datesWithCounts = Object.keys(dateCounts).map(date => ({
        date,
        count: dateCounts[date]
    }));

    // Check if there are less than 10 documents
    if (datesWithCounts.length < 10) {
        // Find the range of dates to cover 30 days
        const startDate = subDays(new Date(), 20); // 20 days ago from today
        const endDate = addDays(new Date(), 10); // 10 days from today

        const fullMonthDates: { date: string, count: number }[] = [];

        for (let d = startDate; d <= endDate; d = addDays(d, 1)) {
            const dateString = d.toISOString().split('T')[0];
            const count = dateCounts[dateString] || 0;
            fullMonthDates.push({ date: dateString, count });
        }

        return fullMonthDates;
    }

    return datesWithCounts;
}


export function calculateAverageUserStay(documents: ChatDocument[]): number {
    if (documents.length === 0) return 0;

    let totalDuration = 0;

    documents.forEach(doc => {
        const createdAt = new Date(doc.createdAt).getTime();
        const updatedAt = new Date(doc.updatedAt).getTime();
        const duration = updatedAt - createdAt; // Duration in milliseconds
        totalDuration += duration;
    });

    // Calculate the average stay duration in milliseconds
    const avgDuration = totalDuration / documents.length;

    // Convert milliseconds to minutes (or any other time unit you prefer)
    const avgDurationInMinutes = avgDuration / (1000 * 60);

    return avgDurationInMinutes;
}

export function getTotalNumberOfConversations(documents: ChatDocument[]): number {
    let totalConversations = 0;

    documents.forEach(doc => {
        totalConversations += doc.conversation.length;
    });

    return totalConversations;
}

export function getAverageChatLength(documents: ChatDocument[]): number {
    if (documents.length === 0) return 0;

    let totalMessages = 0;

    documents.forEach(doc => {
        totalMessages += doc.conversation.length;
    });

    const averageChatLength = totalMessages / documents.length;
    return averageChatLength;
}

export function getChatUsagePerWeek(documents: ChatDocument[]): { day: string, count: number, fill: string }[] {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayCounts: Record<string, number> = {
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0
    };
  
    const dayColors: Record<string, string> = {
      Sunday: "var(--color-sunday)",
      Monday: "var(--color-monday)",
      Tuesday: "var(--color-tuesday)",
      Wednesday: "var(--color-wednesday)",
      Thursday: "var(--color-thursday)",
      Friday: "var(--color-friday)",
      Saturday: "var(--color-saturday)"
    };
  
    documents.forEach(doc => {
      const dayIndex = new Date(doc.createdAt).getDay(); // 0 (Sunday) to 6 (Saturday)
      const dayName = daysOfWeek[dayIndex];
      dayCounts[dayName]++;
    });
  
    return daysOfWeek.map(day => ({
      day,
      count: dayCounts[day],
      fill: dayColors[day]
    }));
  }
