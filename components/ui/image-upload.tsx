"use client";

import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/firebase-config";


interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [img, setImg] = useState<File | null>(null);

  useEffect(() => {
      setIsMounted(true);
  }, []);

  const handleClick = () => {
    const fileInput = document.getElementById("imageInput");
    if (fileInput) {
      fileInput.click();
    }
  };

  const uploadFile = (file: File) => {
  const fileName = new Date().getTime() + file.name;
  const storageRef = ref(storage, 'images/' + fileName);
  const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, 
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          onChange(downloadURL);
        });
      }
    );
  }

  useEffect(() => {
    img && uploadFile(img);
  }, [img]);

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImg(event.target.files?.[0] || null);
  };
  

  if (!isMounted) {
      return null;
  }
  
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-m overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button 
                type="button" 
                onClick={() => {
                  onRemove(url);
                  const fileInput = document.getElementById("imageInput") as HTMLInputElement;
                  if (fileInput) {
                    fileInput.value = "";
                  }
                }}
                variant="destructive" 
                size="icon"
              >
                <Trash className="w-4 h-4"/>
              </Button>
            </div>
            <Image 
              fill
              sizes="1x"
              className="object-cover"
              alt="Image"
              src={url}
            />
          </div>
        ))}
      </div>


      <input
        id="imageInput"
        type="file"
        accept="image/*"
        onChange={onUpload}
        hidden
      />

      <Button
        type="button"
        variant="secondary"
        disabled={disabled}
        onClick={handleClick}
      >
        <ImagePlus className="h-4 w-4 mr-2"/>
        Upload an image
      </Button>

    </div>
  );
}

export default ImageUpload;