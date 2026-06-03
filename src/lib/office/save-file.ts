export async function saveTextFile(fileName: string, text: string, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type: mimeType });
  await saveBlob(fileName, blob);
}

export async function saveBlob(fileName: string, blob: Blob) {
  type FileSystemWritable = {
    write: (data: Blob) => Promise<void>;
    close: () => Promise<void>;
  };
  type FileSystemHandle = {
    createWritable: () => Promise<FileSystemWritable>;
  };

  const picker = (
    window as Window & {
      showSaveFilePicker?: (options?: { suggestedName?: string }) => Promise<FileSystemHandle>;
    }
  ).showSaveFilePicker;

  if (typeof picker === "function") {
    const handle = await picker({ suggestedName: fileName });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
