import { useParams } from "react-router-dom";

const ProductDetail = () => {
    const { productId } = useParams();
    return <h1 className="text-3xl font-bold">Product Detail: {productId}</h1>;
};

export default ProductDetail;
