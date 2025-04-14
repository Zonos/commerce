"use client";
import { type ReactNode, createContext, useMemo, useState } from "react";

import Script from "next/script";

type ZonosScriptProps = {
  scriptLoaded: boolean;
};

const ZONOS_CDN_URL = process.env.NEXT_PUBLIC_ZONOS_CDN_URL;

export const ZonosScriptContext = createContext<ZonosScriptProps>({
  scriptLoaded: false,
});

export const ZonosScriptContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const context: ZonosScriptProps = {
    scriptLoaded,
  };
  const timestamp = useMemo(() => Date.now(), []);
  return (
    <ZonosScriptContext.Provider value={context}>
      <Script
        onLoad={() => setScriptLoaded(true)}
        src={`${ZONOS_CDN_URL}/dist/scripts/loadZonos.js?timestamp=${timestamp}`}
      />
      {children}
    </ZonosScriptContext.Provider>
  );
};
