import { db } from "@/lib/firebase/firebase-config";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { ProductForm } from "./components/product-form";
import { Category, Color, Product, Size } from "@/types/types";

const ProductPage = async ({
  params
}: {
  params: { productId: string, storeId: string}
}) => {
  const docRef = doc(db, 'stores', params.storeId, 'products', params.productId);
  const productDoc = await getDoc(docRef);
  const productData = productDoc.data(); 
  if (productData) {
    productData.createdAt = productData.createdAt.toDate();
    productData.updatedAt = productData.updatedAt.toDate();
  }
  const product = productData as Product; 

  const categorySnapshot = await getDocs(
    query(
      collection(db,"stores", params.storeId, "categories")
    ));

  const categories: Category[] = []; 
  categorySnapshot.forEach((doc) => {
    const data = doc.data();
    categories.push({ 
      ...data,
      id: doc.id, 
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Category);
  });

  const sizeSnapshot = await getDocs(
    query(
      collection(db,"stores", params.storeId, "sizes")
    ));

  const sizes: Size[] = []; 
  sizeSnapshot.forEach((doc) => {
    const data = doc.data();
    sizes.push({ 
      ...data,
      id: doc.id, 
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Size);
  });

  const colorSnapshot = await getDocs(
    query(
      collection(db,"stores", params.storeId, "colors")
    ));

  const colors: Color[] = []; 
  colorSnapshot.forEach((doc) => {
    const data = doc.data();
    colors.push({ 
      ...data,
      id: doc.id, 
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Color);
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          categories={categories}
          sizes={sizes}
          colors={colors}
          initialData={product}
        />
      </div>
    </div>
  );
}

export default ProductPage;