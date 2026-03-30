import { usePathname } from "expo-router";
import { useEffect } from "react";

export function ScreenDebug() {
  const pathname = usePathname();

  useEffect(() => {
    console.log(`Screen Name: ${pathname}`);
  }, [pathname]);

  return null;
}
