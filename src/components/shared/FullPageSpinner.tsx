import { LoaderCircle } from 'lucide-react';

export default function FullPageSpinner() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
