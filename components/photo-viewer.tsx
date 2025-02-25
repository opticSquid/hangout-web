// "use client";

export function PhotoViewer({ filename }: { filename: string }) {
  const extractedFilename = filename.replace(/\.[^.]+$/, "");
  const baseUrl = `${process.env.NEXT_PUBLIC_MEDIA_SERVER_URL}/${extractedFilename}`;

  return (
    <div>
      <img
        src={`${baseUrl}/${extractedFilename}_144.avif`}
        srcSet={`
                    ${baseUrl}/${extractedFilename}_144.avif 144w,
                    ${baseUrl}/${extractedFilename}_360.avif 360w,
                    ${baseUrl}/${extractedFilename}_720.avif 720w,
                    ${baseUrl}/${extractedFilename}_1080.avif 1080w
                `}
        sizes="(max-height: 144px) 144px, 
                       (max-height: 360px) 360px, 
                       (max-height: 720px) 720px, 
                       1080px"
        alt={filename}
        className="w-full h-auto"
      />
    </div>
  );
}
