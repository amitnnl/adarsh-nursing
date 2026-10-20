import type { Metadata } from "next";
import { Gallery } from "@/components/gallery";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/section";
import { getGalleryPhotos, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos of the Adarsh College of Nursing campus, labs, classrooms, and student life.",
};

export default async function GalleryPage() {
  const [photos, site] = await Promise.all([
    getGalleryPhotos(),
    getSiteSettings(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Campus Gallery"
        title="A look around the campus."
        text="The college building, modern nursing labs, library, hostel and campus life at Adarsh College of Nursing."
      />
      <section className="container-x py-16">
        <Gallery photos={photos} />
      </section>
      <CtaBand siteData={site} />
    </>
  );
}

