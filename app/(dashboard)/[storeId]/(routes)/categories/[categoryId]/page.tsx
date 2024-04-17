import { db } from "@/lib/firebase/firebase-config";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { CategoryForm } from "./components/category-form";
import { Billboard, Category } from "@/types/types";

const CategoryPage = async ({
  params
}: {
  params: { categoryId: string, storeId: string}
}) => {
  const docRef = doc(db, 'stores', params.storeId, 'categories', params.categoryId);
  const categoryDoc = await getDoc(docRef);
  const categoryData = categoryDoc.data(); 
  if (categoryData) {
    categoryData.createdAt = categoryData.createdAt.toDate();
    categoryData.updatedAt = categoryData.updatedAt.toDate();
  }
  const category = categoryData as Category; 

  const billboardSnapshot = await getDocs(
    query(
      collection(db,"stores", params.storeId, "billboards")
    ));

  const billboards: Billboard[] = []; 
  billboardSnapshot.forEach((doc) => {
    const data = doc.data();
    billboards.push({ 
      ...data,
      id: doc.id, 
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Billboard);
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm 
          billboards={billboards}
          initialData={category}
        />
      </div>
    </div>
  );
}

export default CategoryPage;