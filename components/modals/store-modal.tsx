'use client';

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { auth } from "@/app/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { getIdToken } from 'firebase/auth';

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1, { 
    message: "Name is required" 
  }),
});

export const StoreModal = () => {
  const [user] = useAuthState(auth);

  const storeModal = useStoreModal();

  const [ formLoading, setFormLoading ] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setFormLoading(true);

      try {
        if (!user) {
          throw new Error("Unauthorized");
        } else {
        const response = await axios.post("/api/stores", values, {
          headers: {
            Authorization: `Bearer ${await getIdToken(user)}`,
          },
        });
        
        toast.success("Store created.");
        }
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <Modal 
      title="Create store" 
      description="Add a new store to manage products and catergories." 
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="sapce-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                    disabled={formLoading}
                    placeholder="E-Commerce" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end">
              <Button 
                disabled={formLoading}
                variant="outline"
                onClick={storeModal.onClose}
              >
                Cancel
                </Button>
              <Button disabled={formLoading} type="submit">Continue</Button>
            </div>
            </form>
          </Form>
        </div> 
      </div>

    </Modal>
  );
}
