export function optimizeImageUrl(
  originalUrl: string,
  width: number = 100,
  gravity: string = "face"
) {
  const cloudinaryBaseUrl = "https://res.cloudinary.com/";
  const urlParts = originalUrl.split("/");

  // Find the index of the image version, usually prefixed with 'v'
  const versionIndex = urlParts.findIndex((part) => part.startsWith("v"));

  // Inject optimization parameters after the cloud name and project folder
  urlParts.splice(versionIndex, 0, `c_thumb,w_${width},g_${gravity}`);

  // Join the parts to create the optimized URL
  const optimizedUrl = urlParts.join("/");
  return optimizedUrl;
}
