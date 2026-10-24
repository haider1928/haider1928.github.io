import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { contentQuery } from "@/lib/content";
import { useVisitor } from "@/lib/visitor";
import { Icon } from "./icons";

export function PurposeDialog() {
  const { data } = useSuspenseQuery(contentQuery);
  const { dialogOpen, setDialogOpen, setPurpose, purpose } = useVisitor();
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome! What brings you here?</DialogTitle>
          <DialogDescription>
            Totally optional. I'll just highlight what's most useful for you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          {data.purposes.map((p) => (
            <button
              key={p.key}
              onClick={() => setPurpose(p.key)}
              className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:border-primary/60 ${purpose === p.key ? "border-primary bg-primary/10" : "border-border"}`}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-secondary text-primary">
                <Icon name={p.icon} className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-medium">{p.label}</span>
                <span className="block text-xs text-muted-foreground">{p.description}</span>
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setDialogOpen(false)}
          className="mt-1 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Skip for now
        </button>
      </DialogContent>
    </Dialog>
  );
}
