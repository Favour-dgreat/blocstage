"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import LandingPage from "./landingpage/page"
export default function Home() {
  return (
    <div className="">
      <LandingPage />
    </div>
  );
}