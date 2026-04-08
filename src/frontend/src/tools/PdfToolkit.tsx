import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Download, FileText, Loader2, Upload } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import { toast } from "sonner";

type PdfAction = "merge" | "split" | "compress" | "img2pdf";

const ACTIONS: { id: PdfAction; label: string; desc: string }[] = [
  {
    id: "merge",
    label: "Merge PDFs",
    desc: "Combine multiple PDF files into one document.",
  },
  {
    id: "split",
    label: "Split PDF",
    desc: "Extract a range of pages from a PDF file.",
  },
  {
    id: "compress",
    label: "Compress PDF",
    desc: "Reduce PDF file size by removing metadata.",
  },
  {
    id: "img2pdf",
    label: "Images → PDF",
    desc: "Convert JPG/PNG images to a single PDF.",
  },
];

function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
  return u8.buffer.slice(
    u8.byteOffset,
    u8.byteOffset + u8.byteLength,
  ) as ArrayBuffer;
}

function downloadBlob(bytes: Uint8Array, filename: string) {
  const blob = new Blob([toArrayBuffer(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function PdfToolkit() {
  const [tab, setTab] = useState<PdfAction>("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [splitFrom, setSplitFrom] = useState("1");
  const [splitTo, setSplitTo] = useState("1");

  const accept =
    tab === "img2pdf" ? "image/jpeg,image/png,image/jpg" : "application/pdf";
  const multiple = tab === "merge" || tab === "img2pdf";

  const handleTabChange = (v: string) => {
    setTab(v as PdfAction);
    setFiles([]);
  };

  const processAction = async () => {
    if (files.length === 0) return;
    setLoading(true);
    try {
      if (tab === "merge") {
        const merged = await PDFDocument.create();
        for (const file of files) {
          const bytes = await file.arrayBuffer();
          const src = await PDFDocument.load(bytes);
          const pages = await merged.copyPages(src, src.getPageIndices());
          for (const page of pages) merged.addPage(page);
        }
        const out = await merged.save();
        downloadBlob(out, "merged.pdf");
        toast.success("PDFs merged!", {
          description: `${files.length} files combined successfully.`,
        });
      } else if (tab === "split") {
        const bytes = await files[0].arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const total = src.getPageCount();
        const from = Math.max(1, Number.parseInt(splitFrom) || 1) - 1;
        const to = Math.min(total, Number.parseInt(splitTo) || total) - 1;
        if (from > to) {
          toast.error("Invalid page range.");
          return;
        }
        const out = await PDFDocument.create();
        const indices = Array.from(
          { length: to - from + 1 },
          (_, i) => from + i,
        );
        const pages = await out.copyPages(src, indices);
        for (const page of pages) out.addPage(page);
        const saved = await out.save();
        downloadBlob(saved, `split_pages_${from + 1}_to_${to + 1}.pdf`);
        toast.success("PDF split!", {
          description: `Pages ${from + 1}–${to + 1} extracted.`,
        });
      } else if (tab === "compress") {
        const bytes = await files[0].arrayBuffer();
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        // Remove metadata to reduce size
        src.setTitle("");
        src.setAuthor("");
        src.setSubject("");
        src.setKeywords([]);
        src.setProducer("");
        src.setCreator("");
        const saved = await src.save({ useObjectStreams: true });
        const reduction = (
          ((bytes.byteLength - saved.byteLength) / bytes.byteLength) *
          100
        ).toFixed(1);
        downloadBlob(saved, "compressed.pdf");
        toast.success("PDF compressed!", {
          description: `Reduced by ~${reduction}% (${(bytes.byteLength / 1024).toFixed(0)} KB → ${(saved.byteLength / 1024).toFixed(0)} KB)`,
        });
      } else if (tab === "img2pdf") {
        const doc = await PDFDocument.create();
        for (const file of files) {
          const imgBytes = await file.arrayBuffer();
          const img =
            file.type === "image/png"
              ? await doc.embedPng(imgBytes)
              : await doc.embedJpg(imgBytes);
          const page = doc.addPage([img.width, img.height]);
          page.drawImage(img, {
            x: 0,
            y: 0,
            width: img.width,
            height: img.height,
          });
        }
        const saved = await doc.save();
        downloadBlob(saved, "images.pdf");
        toast.success("Images converted!", {
          description: `${files.length} image(s) saved as PDF.`,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Processing failed", {
        description: "Please check the file format and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-4 h-auto gap-1 bg-muted/50 p-1 text-xs">
          <TabsTrigger
            value="merge"
            className="text-xs py-1.5"
            data-ocid="pdf-tab-merge"
          >
            Merge
          </TabsTrigger>
          <TabsTrigger
            value="split"
            className="text-xs py-1.5"
            data-ocid="pdf-tab-split"
          >
            Split
          </TabsTrigger>
          <TabsTrigger
            value="compress"
            className="text-xs py-1.5"
            data-ocid="pdf-tab-compress"
          >
            Compress
          </TabsTrigger>
          <TabsTrigger
            value="img2pdf"
            className="text-xs py-1.5"
            data-ocid="pdf-tab-img2pdf"
          >
            Img→PDF
          </TabsTrigger>
        </TabsList>

        {ACTIONS.map(({ id, desc }) => (
          <TabsContent key={id} value={id} className="mt-3 flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">{desc}</p>

            <label
              className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border/50 rounded-xl cursor-pointer hover:border-primary/50 transition-colors"
              data-ocid={`pdf-upload-${id}`}
            >
              <Upload className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {multiple
                  ? "Click to upload multiple files"
                  : "Click to upload a file"}
              </span>
              <span className="text-xs text-muted-foreground/60">
                {id === "img2pdf" ? "JPEG, PNG supported" : "PDF files only"}
              </span>
              <input
                type="file"
                accept={accept}
                multiple={multiple}
                className="hidden"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
            </label>

            {id === "split" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground">
                    From page
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={splitFrom}
                    onChange={(e) => setSplitFrom(e.target.value)}
                    className="bg-background/50"
                    data-ocid="pdf-split-from"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground">
                    To page
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={splitTo}
                    onChange={(e) => setSplitTo(e.target.value)}
                    className="bg-background/50"
                    data-ocid="pdf-split-to"
                  />
                </div>
              </div>
            )}

            {files.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {files.map((f) => (
                  <div
                    key={f.name}
                    className="glass rounded-lg px-3 py-2 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-foreground truncate flex-1">
                      {f.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {(f.size / 1024).toFixed(0)} KB
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {files.length > 0 && (
        <div className="glass rounded-lg p-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-xs text-foreground">
            {files.length} file{files.length > 1 ? "s" : ""} ready — click
            Process to download result
          </p>
        </div>
      )}

      <Button
        type="button"
        disabled={files.length === 0 || loading}
        onClick={processAction}
        className="bg-gradient-to-r from-primary to-accent"
        data-ocid="pdf-process"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            {ACTIONS.find((a) => a.id === tab)?.label ?? "Process PDF"}
          </>
        )}
      </Button>
    </div>
  );
}
