import Banner from "@/components/Banner";

import Sellers from "@/components/Sellers";
import Brands from "@/components/Brands";
import Collection from "@/components/Collection";
import Furniture from "@/components/Furniture";
import Rules from "@/components/Rules";
import Latestarticle from "@/components/Latestarticle";
import Categories from "@/components/Categorys/Categories";

export default function HomePage() {
  return (
    <>
      <Banner />
      <Categories />
      <Sellers />
      <Brands />
      <Collection />
      <Furniture />
      <Rules />
      <Latestarticle />
    </>
  );
}
