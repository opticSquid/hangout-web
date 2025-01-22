export default async function Comments({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  return <h1>{(await params).postId}</h1>;
}
