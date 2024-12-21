import { Button } from "./ui/button";

export function BottomBar() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t p-4 z-50 bg-background">
      <div className="flex justify-around">
        <Button className="text-gray-500 hover:text-blue-500">Home</Button>
      </div>
    </footer>
  );
}
