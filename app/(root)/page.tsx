'use client';

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, onSnapshot, deleteDoc, updateDoc, doc } from "firebase/firestore"; 
import { db } from "@/app/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebaseConfig";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";

export default function Home() {
  const onOpen  = useStoreModal((state) => state.onOpen);
  const isOpen  = useStoreModal((state) => state.isOpen);
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  
  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);
  
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4 bg-gray-100">
        <p>Loading...</p>
      </main>
    );
  }

  // Redirect to sign in if no user
  if (!user && !loading) {
      router.push('/sign-in')
  }

  if (user) {
    return (
      <main className="flex min-h-screen flex-col items-center">
        Root page
        <Button 
        size="default"
        variant="destructive"
        onClick={() => {
          signOut(auth)
        }}>
          Log out
        </Button>
      </main>
    );
  }
}
