import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";

export default function Explore() {
  const divs = [];

  for (let i = 0; i < 500; i++) {
    divs.push(i);
  }
  return (
    <div>
      {divs.map((d) => (
        <div key={d}>Hello, {d}</div>
      ))}
    </div>
  );
}
