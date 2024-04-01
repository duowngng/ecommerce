'use client';

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useRouter } from 'next/navigation'
import { UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";

export default function Home() {
  const onOpen  = useStoreModal((state) => state.onOpen);
  const isOpen  = useStoreModal((state) => state.isOpen);

  const SignOutButton = () => {
    const { signOut } = useClerk();
    const router = useRouter()

    return (
      <Button 
      variant="destructive"
      onClick={() => signOut(() => router.push("/"))}
      >
        Sign out
      </Button>
    );
  };

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    // <main className="flex min-h-screen flex-col items-center">
    //   <UserButton afterSignOutUrl="/"/>
    //   Root page
    //   <SignOutButton />
    // </main>
    null
  );
}
