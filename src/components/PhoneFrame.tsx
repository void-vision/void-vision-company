import Image from "next/image";
import type { Screen } from "@/content/site";

/** iPhone 16 Pro bezel around a product screenshot (from raw/PhoneFrame.dc.html). */
export function PhoneFrame({ screen, sizes }: { screen: Screen; sizes: string }) {
  return (
    <figure className="phone">
      <div className="phone-body">
        <div className="phone-screen" style={{ background: screen.tone ?? "#ffffff" }}>
          <Image
            src={screen.src}
            alt={screen.alt}
            width={screen.width}
            height={screen.height}
            sizes={sizes}
            className="phone-shot"
          />
          {screen.bar === "auto" && (
            <div className="phone-statusbar" aria-hidden="true">
              <span className="phone-time">9:41</span>
              <span className="phone-island">
                <span />
              </span>
              <span className="phone-icons">
                <svg viewBox="0 0 18 12" style={{ width: "4.4cqw" }} fill="#0b0b0c">
                  <rect x="0" y="7" width="3" height="5" rx="1" />
                  <rect x="5" y="5" width="3" height="7" rx="1" />
                  <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
                  <rect x="15" y="0" width="3" height="12" rx="1" />
                </svg>
                <svg viewBox="0 0 24 24" style={{ width: "4.1cqw" }} fill="#0b0b0c">
                  <path d="M12 21l3.5-4.5a5.5 5.5 0 0 0-7 0L12 21zm-7.5-9.5a10.5 10.5 0 0 1 15 0l-2.2 2.7a7.5 7.5 0 0 0-10.6 0l-2.2-2.7zM.7 7.6l2.2 2.7a13.5 13.5 0 0 1 18.2 0l2.2-2.7a16.5 16.5 0 0 0-22.6 0z" />
                </svg>
                <svg viewBox="0 0 27 13" style={{ width: "6.6cqw" }}>
                  <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke="#0b0b0c" strokeOpacity="0.35" />
                  <rect x="2" y="2" width="16" height="9" rx="2" fill="#0b0b0c" />
                  <rect x="24" y="4" width="2.5" height="5" rx="1.25" fill="#0b0b0c" fillOpacity="0.4" />
                </svg>
              </span>
            </div>
          )}
          {screen.bar === "island" && <span className="phone-island-only" aria-hidden="true" />}
        </div>
        <Image
          src="/images/iphone-16-pro-black.png"
          alt=""
          aria-hidden="true"
          width={1350}
          height={2760}
          sizes={sizes}
          className="phone-bezel"
        />
      </div>
    </figure>
  );
}
