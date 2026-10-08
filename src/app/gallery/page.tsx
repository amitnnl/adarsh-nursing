import type { Metadata } from "next";
import { Gallery } from "@/components/gallery";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/section";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos of the Adarsh College of Nursing campus at Niwaz Nagar, Narnaul.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A look around the campus."
        text="The college building, lawns and entrance at Niwaz Nagar. More photographs of classrooms, labs and hostel will be added soon."
      />
      <section className="container-x py-24">
        <Gallery />
      </section>
      <CtaBand />
    </>
  );
}
