"use client";

import { IAuthContext } from "@/types/auth";
import { createContext } from "react";

export const AuthContext = createContext<IAuthContext | null>(null);

