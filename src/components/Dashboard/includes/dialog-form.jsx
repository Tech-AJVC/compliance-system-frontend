import FormGenerate from "@/components/includes/FormGenrate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// import { z } from "zod";

export default function DialogForm({
  title,
  description,
  submitText,
  isOpen,
  onClose,
  formFields,
  variant,
  form,
  onSubmit,
  onFileChange,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} className="">
      <DialogContent >
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <ScrollArea className={"max-h-[70vh] ps-2 pe-4"} tabIndex={0}>
          <FormGenerate
            className=""
            form={form}
            onSubmit={onSubmit}
            formFields={formFields}
            submitText={submitText}
            onFileChange={onFileChange}
          ></FormGenerate>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
