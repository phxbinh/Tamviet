import AttributeValuesClient from "./AttributeValuesClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AttributeValuesClient attributeId={id} />;
}