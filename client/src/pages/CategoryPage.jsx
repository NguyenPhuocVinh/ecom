import { useParams } from "react-router-dom";

const CategoryPage = () => {
    const { categoryId } = useParams();
    return <h1 className="text-3xl font-bold">Category: {categoryId}</h1>;
};

export default CategoryPage;
