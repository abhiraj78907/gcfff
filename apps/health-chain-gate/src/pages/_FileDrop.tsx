import { useRef } from "react";
import { Label } from "@gate/components/ui/label";
import { Button } from "@gate/components/ui/button";
import { Upload, X } from "lucide-react";

type Props = {
  label: string;
  required?: boolean;
  files: Array<File & { preview?: string }>;
  accept?: string;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onPick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
};

export const FileDrop = ({ label, required, files, accept, onDrop, onPick, onRemove }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div>
      <Label className="text-sm font-medium">{label}{required && <span className="text-destructive"> *</span>}</Label>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        className="mt-2 border border-dashed rounded-lg p-5 md:p-6 flex flex-col items-center justify-center text-sm text-muted-foreground hover:border-primary cursor-pointer min-h-28 md:min-h-24"
        aria-label={label}
      >
        <Upload className="w-5 h-5 mb-1" />
        Drag & drop files here or click to browse
        <input ref={inputRef} type="file" className="hidden" multiple accept={accept} onChange={onPick} />
      </div>
      {files.length > 0 && (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {files.map((f, idx) => (
            <div key={idx} className="border rounded p-2 flex items-center gap-2">
              {f.type?.startsWith("image/") && f.preview && (
                <img src={f.preview} alt={f.name} className="w-10 h-10 object-cover rounded" />
              )}
              <div className="flex-1 truncate">
                <div className="text-xs font-medium truncate">{f.name}</div>
                <div className="text-[10px] text-muted-foreground">{Math.round((f.size || 0)/1024)} KB</div>
              </div>
              <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${f.name}`} onClick={() => onRemove(idx)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileDrop;


