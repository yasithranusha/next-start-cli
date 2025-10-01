import Container from "@/components/layout/container";
import Link from "next/link";

export default function Home() {
  return (
    <Container>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </Container>
  );
}
