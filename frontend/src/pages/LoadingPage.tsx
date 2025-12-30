import { Progress } from "@/components/ui/progress";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center w-full max-w-md space-y-4 px-4">
        <p className="text-lg text-muted-foreground">Loading...</p>
        <Progress value={50} className="w-full" />
      </div>
    </div>
  );
}