


## Cách gọi
```typescript
const metadata =
  await generateSectionMetadata(
    section.title,
    section.content,
    section.sectionPath
  );

await tx
  .insert(
    documentSections
  )
  .values({
    ...

    sectionType:
      metadata.sectionType,

    keywords:
      metadata.keywords,

    intentTags:
      metadata.intentTags,
  });
```