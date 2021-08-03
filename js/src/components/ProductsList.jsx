import Product from "./Product";
import { useProductsContext } from "./Shop";

export default function ProductsList() {
  const products = useProductsContext();
  return (
    <div className="products">
      {products.map((product) => (
        <Product key={product.id} {...product} />
      ))}
    </div>
  );
}
