import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { MapPin } from "lucide-react";

export function MapPlaceholder() {
  const mapImage = PlaceHolderImages.find((img) => img.id === "map-placeholder");

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            Sample Locations
        </CardTitle>
        <CardDescription>
          Geographical distribution of water sample sites.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {mapImage && (
          <div className="relative w-full h-full min-h-[250px] rounded-lg overflow-hidden">
          <Image
            src={mapImage.imageUrl}
            alt={mapImage.description}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={mapImage.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="font-bold text-lg">World Map</h3>
            <p className="text-sm">7 locations monitored</p>
          </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
