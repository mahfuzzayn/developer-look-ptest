"use client"

import { ITasksContext } from "@/types";
import { createContext } from "react";

export const TaskContext = createContext<ITasksContext | null>(null);
