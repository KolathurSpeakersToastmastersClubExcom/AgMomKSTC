import { cn } from "@/lib/utils";

interface ImageSource {
  src: string;
  alt: string;
}

interface ShowImageListItemProps {
  key?: any;
  text: string;
  images: [ImageSource, ImageSource];
}

function RevealImageListItem({ text, images }: ShowImageListItemProps) {
  const container = "absolute right-8 -top-1 z-40 h-20 w-16 animate-fade-in";
  const effect =
    "relative duration-500 delay-100 shadow-none group-hover:shadow-xl scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 group-hover:w-full group-hover:h-full w-16 h-16 overflow-hidden transition-all rounded-md";

  return (
    <div className="group relative h-fit w-full overflow-visible py-4 md:py-5 border-b border-slate-100/40 last:border-0">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-foreground transition-all duration-500 group-hover:opacity-40 leading-tight">
        {text}
      </h1>
      <div className={container}>
        <div className={effect}>
          <img alt={images[1].alt} src={images[1].src} className="h-full w-full object-cover" />
        </div>
      </div>
      <div
        className={cn(
          container,
          "translate-x-0 translate-y-0 rotate-0 transition-all delay-150 duration-500 group-hover:translate-x-6 group-hover:translate-y-6 group-hover:rotate-12",
        )}
      >
        <div className={cn(effect, "duration-200")}>
          <img alt={images[0].alt} src={images[0].src} className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}

function RevealImageList() {
  const items: ShowImageListItemProps[] = [
    {
      text: "Public Speaking",
      images: [
        {
          src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=200&auto=format&fit=crop&q=60",
          alt: "Microphone on stage",
        },
        {
          src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&auto=format&fit=crop&q=60",
          alt: "Presenter speaking to audience",
        },
      ],
    },
    {
      text: "Structured Communication",
      images: [
        {
          src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&auto=format&fit=crop&q=60",
          alt: "Workshop board mapping ideas",
        },
        {
          src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=60",
          alt: "Structured team collaboration",
        },
      ],
    },
    {
      text: "Leadership Skills",
      images: [
        {
          src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=60",
          alt: "Leader leading a discussion",
        },
        {
          src: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=200&auto=format&fit=crop&q=60",
          alt: "Professional mentorship session",
        },
      ],
    },
    {
      text: "Practice Impromptu Speaking Skills",
      images: [
        {
          src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=200&auto=format&fit=crop&q=60",
          alt: "Active impromptu discussion",
        },
        {
          src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=200&auto=format&fit=crop&q=60",
          alt: "Expressive group speaking",
        },
      ],
    },
  ];
  return (
    <div className="flex flex-col gap-1 rounded-sm bg-background px-4 md:px-8 py-4">
      <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-2">Our services</h3>
      {items.map((item, index) => (
        <RevealImageListItem key={index} text={item.text} images={item.images} />
      ))}
    </div>
  );
}

export { RevealImageList };
