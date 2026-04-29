import { Button } from "@prosopopeia/ui/components/button";
import { PlusIcon } from "lucide-react";

export default async function Page() {
  return (
    <div>
      <Button>
        <PlusIcon />
        Testando interface
      </Button>
    </div>
  );
}
