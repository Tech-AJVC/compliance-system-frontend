import BadgeStatusTask from "@/components/includes/badge-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { renderCell } from "@/lib/renderCell"; // Import shared utility
import { cn } from "@/lib/utils";
import {
  Calendar,
  CheckCircle,
  CircleUserRound,
  File,
  Timer,
  TriangleAlert,
} from "lucide-react";

const taskDataSchema = [
  { key: "deadline", label: "Due by", type: "date", icon: <Timer size={20} /> },
  {
    key: "recurrence",
    label: "Repeat Task",
    type: "text",
    icon: <Calendar size={20} />,
  },
  {
    key: "documents",
    label: "Attachments",
    type: "file",
    icon: <File size={20} />,
  },
  {
    key: "predecessorTask",
    label: "Predecessor Task",
    type: "link",
    icon: <TriangleAlert size={20} className="text-yellow-500" />,
  },
  { key: "category", label: "Category", type: "text" },
  { key: "assignee_name", label: "Assignee Name", type: "user" },
  { key: "reviewer_name", label: "Reviewer Name", type: "user" },
  { key: "approver_name", label: "Approver Name", type: "user" },
  {
    key: "created_at",
    label: "Created At",
    type: "date",
    icon: <Timer size={20} />,
  },
  {
    key: "updated_at",
    label: "Last Updated",
    type: "date",
    icon: <Timer size={20} />,
  },
];

export default function SheetTaskViewFM({
  data = {},
  isOpen = true,
  onClose = () => {},
  openEdit = () => {},
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className={cn("w-full md:w-1/2")}>
        <SheetHeader className="mt-4 pb-0 md:mt-8">
          {data?.category && <Badge variant="outline">{data.category}</Badge>}
          <SheetTitle>{data?.title}</SheetTitle>
          <SheetDescription>
            {data?.description || "No description provided"}
          </SheetDescription>
          <BadgeStatusTask type="success" text={data?.state} className="mt-2" />
          {data?.assignee_id && (
            <div className="mt-2 flex items-center gap-2">
              <CircleUserRound className="h-6 w-6" />
              <span className="text-sm font-semibold">
                {data.assignee_name}
              </span>
              <Badge variant="secondary">Current Owner</Badge>
            </div>
          )}
        </SheetHeader>
        <hr className="mx-auto w-11/12" />

        <table className="mx-auto w-11/12 text-sm">
          <tbody>
            {taskDataSchema.map(({ key, label, type, icon }) =>
              renderCell(key, label, type, icon, data),
            )}
          </tbody>
        </table>
        <Button onClick={() => openEdit(data)} className="mx-auto mt-4 w-11/12">
          Edit Task
        </Button>
      </SheetContent>
    </Sheet>
  );
}
