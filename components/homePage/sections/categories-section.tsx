import { CategoryCard } from "@/components/homePage/shared/category-card";

const categories = [
  {
    title: "Water Sports",
    image: "/travel.jpg",
    icon: "Snowflake",
  },
  {
    title: "Desert Discoveries",
    image: "/travel2.jpg",
    icon: "Tag",
  },
  {
    title: "Popular Trips",
    image: "/travel3.jpg",
    icon: "Telescope",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-20">
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0">
          {categories.map((category) => (
            <div key={category.title} className="flex-shrink-0 w-[85vw] md:w-auto">
              <CategoryCard
                title={category.title}
                image={category.image}
                icon={category.icon}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
