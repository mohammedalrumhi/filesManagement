export function checkFileType(fileName) {
  // Get the file extension
  const extension = fileName.split(".").pop().toLowerCase();

  // Regular expressions to match extensions
  const imageExtensions = /jpg|jpeg|png|gif|bmp|svg/;
  const pdfExtension = /pdf|pdfx/;
  const videoExtensions = /mp4|avi|mov|mkv/;
  const docxExtension = /docx|doc/;

  const audioExtensions = /mp3|wav|ogg/;
  const compressExtensions = /zip|rar/;
  const excelExtensions = /xls|xlsx/;
  const pptExtensions = /ppt|pptx/;
  const txtExtension = /txt/;
  const folderExtension = /folder/;

  // Check the extension against different types
  if (imageExtensions.test(extension)) {
    return `<img src="/types/picture.svg" alt="${extension}" />`;
  } else if (pdfExtension.test(extension)) {
    return `<img src="/types/pdf.svg" alt="${extension}" />`;
  } else if (videoExtensions.test(extension)) {
    return `<img src="/types/video.svg" alt="${extension}" />`;
  } else if (docxExtension.test(extension)) {
    return `<img src="/types/word.svg" alt="${extension}" />`;
  } else if (audioExtensions.test(extension)) {
    return `<img src="/types/audio.svg" alt="${extension}" />`;
  } else if (compressExtensions.test(extension)) {
    return `<img src="/types/compress.svg" alt="${extension}" />`;
  } else if (excelExtensions.test(extension)) {
    return `<img src="/types/excel.svg" alt="${extension}" />`;
  } else if (pptExtensions.test(extension)) {
    return `<img src="/types/pptl.svg" alt="${extension}" />`;
  } else if (txtExtension.test(extension)) {
    return `<img src="/types/txt.svg" alt="${extension}" />`;
  } else if (folderExtension.test(extension)) {
    return `<img src="/types/folder.svg" alt="${extension}" />`;
  } else {
    return `<img src="/types/unknown-file.svg" alt="${extension}" />`; // If the extension doesn't match any known types
  }
}
