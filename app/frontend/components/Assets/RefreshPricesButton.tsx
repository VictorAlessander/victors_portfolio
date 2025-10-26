import { Button } from "@/components/ui/button";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { RefreshCwIcon } from "lucide-react";

const RefreshPricesButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    if (confirm("This will fetch current prices from Yahoo Finance for all assets. Continue?")) {
      setIsLoading(true);

      try {
        const response = await fetch("/assets/refresh_prices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || "",
          },
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message + (data.errors.length > 0 ? "\n\nErrors:\n" + data.errors.join("\n") : ""));
          router.reload({ only: ["data"] });
        } else {
          alert("Error: " + data.message + (data.errors.length > 0 ? "\n\nErrors:\n" + data.errors.join("\n") : ""));
        }
      } catch (error) {
        alert("Failed to refresh prices. Please try again.");
        console.error("Error refreshing prices:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Button onClick={handleRefresh} disabled={isLoading}>
      <RefreshCwIcon className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
      {isLoading ? "Refreshing..." : "Refresh Prices"}
    </Button>
  );
};

export default RefreshPricesButton;
