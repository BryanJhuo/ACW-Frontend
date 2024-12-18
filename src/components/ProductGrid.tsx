import ProductCard from "./ProductCard";

function ProductGrid({ items }: { items: any[] }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {items.map((item) => (
        <ProductCard key={item.id} {...item} />
      ))}
    </div>
  );
};

export default ProductGrid;
