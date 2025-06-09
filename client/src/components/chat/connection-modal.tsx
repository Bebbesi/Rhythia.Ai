import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectionModal({ isOpen, onClose }: ConnectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[var(--chat-dark)] border border-gray-700 text-white max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold">Connection Issue</DialogTitle>
          <DialogDescription className="text-gray-300 mt-2">
            Some functionalities may be unavailable
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex justify-center mt-6">
          <Button
            onClick={onClose}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}