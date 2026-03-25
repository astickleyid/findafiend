import dynamic from "next/dynamic";
const FindAFiend = dynamic(() => import("../components/FindAFiend"), { ssr: false });
export default function Home() {
  return <FindAFiend />;
}