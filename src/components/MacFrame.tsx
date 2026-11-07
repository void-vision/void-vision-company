import Image from "next/image";
import type { Screen } from "@/content/site";

/** Desktop counterpart of PhoneFrame: the screenshot already carries the macOS chrome. */
export function MacFrame({ screen, sizes }: { screen: Screen; sizes: string }) {
  return (
    <figure className="mac">
      <div className="mac-body">
        <Image src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} sizes={sizes} className="mac-shot" />
      </div>
    </figure>
  );
}
