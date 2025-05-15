import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import IndividualPost from "./individualPost";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header></Header>
      <IndividualPost></IndividualPost>
      <Footer></Footer>
    </>
  );
}
