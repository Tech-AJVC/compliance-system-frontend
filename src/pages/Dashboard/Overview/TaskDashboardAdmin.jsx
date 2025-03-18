import DialogForm from "@/components/Dashboard/includes/dialog-form";
import SheetTask from "@/components/Dashboard/includes/sheet-task";
import ViewCalanderTaskAdmin from "@/components/Dashboard/view-calander-task-admin";
import ViewListTaskAdmin from "@/components/Dashboard/view-list-task-admin";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import queryClient from "@/query/queryClient";
import {
  taskFormFieldsPart1,
  taskFormFieldsPart2,
  taskFormFieldsPart3,
} from "@/schemas/form/taskSchema";
import { taskSchema } from "@/schemas/zod/taskSchema";
import { apiWithAuth } from "@/utils/api";
import fileUpload from "@/utils/file-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function TaskDashboard() {
  const DialogTaskVariant = {
    create: {
      title: "Create Task",
      description:
        "Create a new task by filling out the form below. All task need to be assigned to someone.",
      submit: "Create",
    },
    edit: {
      title: "Edit Task",
      description: "You can edit the task by changing the details below.",
      submit: "Save",
    },
  };

  const [dialogTask, setDialogTask] = useState({
    isOpen: false,
    variant: "",
    compliance_task_id: "",
    defaultValues: {},
  });

  const [sheetTask, setSheetTask] = useState({
    isOpen: false,
  });

  const handleDialogTaskClose = useCallback((isOpen) => {
    setDialogTask((prev) => ({ ...prev, isOpen }));
  }, []);

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      description: "",
      category: "",
      completion_criteria: "",
      repeat: false,
      predecessor_task: "",
      attachements: [],
      assignee_id: "",
      reviewer_id: "",
      approver_id: "",
    },
  });

  const handleDialogTaskOpen = useCallback(
    (variant, data, compliance_task_id) => {
      if (variant === "create") {
        setDialogTask({
          isOpen: true,
          variant: "create",
          defaultValues: {},
          compliance_task_id: "",
        });
        form.reset({
          description: "",
          category: "",
          completion_criteria: "",
          repeat: false,
          predecessor_task: "",
          attachements: [],
          assignee_id: "",
          reviewer_id: "",
          approver_id: "",
        });
        form.setValue("repeat", false);
        form.setValue("recurrence", "");
      } else {
        setDialogTask({
          isOpen: true,
          variant: "edit",
          defaultValues: data,
          compliance_task_id,
        });
        setSheetTask({ isOpen: false, data: null });
        form.reset(data);
        form.setValue("deadline", new Date(data.deadline));
        if (data.recurrence) {
          form.setValue("repeat", true);
          form.setValue("recurrence", data.recurrence);
        } else {
          form.setValue("repeat", false);
          form.setValue("recurrence", "");
        }
      }
    },
    [form],
  );

  const actionType = [
    {
      title: "View",
      className: "",
      onClick: (data) => {
        setSheetTask({ isOpen: true, data });
      },
    },
    {
      title: "Edit",
      className: "",
      onClick: (data) => {
        handleDialogTaskOpen("edit", data, data.compliance_task_id);
      },
    },
    { title: "Delete", className: "text-red-500", onClick: () => {} },
  ];

  const tabs = [
    {
      title: "List",
      value: "list",
      childern: (
        <ViewListTaskAdmin
          actionType={actionType}
          openView={(data) => {
            setSheetTask({ isOpen: true, data });
          }}
          openEdit={(data) => {
            handleDialogTaskOpen("edit", data, data.compliance_task_id);
          }}
        />
      ),
    },
    {
      title: "Calendar",
      value: "calendar",
      childern: <ViewCalanderTaskAdmin />,
    },
  ];

  const createTask = useCallback(async (data) => {
    try {
      await apiWithAuth.post("/api/tasks/", data);
      toast.success("Task created successfully");
    } catch (error) {
      toast.error("Failed to create task", {
        description: error?.response?.data?.message || "An error occured",
      });
    }
  }, []);

  const editTask = useCallback(
    async (data) => {
      try {
        await apiWithAuth.patch(
          `/api/tasks/${dialogTask.compliance_task_id}`,
          data,
        );
        toast.success("Task updated successfully");
      } catch (error) {
        toast.error("Failed to update task", {
          description: error?.response?.data?.message || "An error occured",
        });
      }
    },
    [dialogTask.compliance_task_id],
  );

  const onSubmit = useCallback(
    async (data) => {
      let { attachments, repeat, ...rest } = data;
      let compliance_task_id = dialogTask.compliance_task_id || null;
      const category = rest.category;
      if (!repeat) {
        rest.recurrence = undefined;
      }

      console.log("rest", data);

      try {
        if (dialogTask.variant === "create") {
          await createTask(rest);
        } else {
          await editTask(rest);
        }

        console.log("attachements", attachments);

        if (attachments?.length) {
          try {
            const promises = attachments.map((file) =>
              fileUpload(file, category),
            );
            const uploadResponse = await Promise.all(promises);
            const document_ids = uploadResponse.map(
              (res) => res.data.document_id,
            );

            console.log("document_ids", document_ids);

            const linkPromises = document_ids.map((document_id) => {
              return apiWithAuth.post(
                `/api/documents/${document_id}/link-to-task`,
                {
                  compliance_task_id: compliance_task_id,
                  document_id: document_id,
                },
              );
            });

            await Promise.all(linkPromises);
            toast.success("Files uploaded successfully");
          } catch (error) {
            toast.error("Failed to upload file", {
              description:
                error?.response?.data?.message || "An error occurred",
            });
          }
        }

        handleDialogTaskClose(false);
        form.reset({});
        queryClient.invalidateQueries("task-querry");
      } catch (error) {
        toast.error("Failed to process task", {
          description: error?.response?.data?.message || "An error occurred",
        });
      }
    },
    [
      createTask,
      dialogTask.variant,
      dialogTask.compliance_task_id,
      editTask,
      form,
      handleDialogTaskClose,
    ],
  );

  const defaultTabs = localStorage.getItem("taskTabs") || "list";

  const handelTabChange = useCallback((value) => {
    localStorage.setItem("taskTabs", value);
  }, []);

  return (
    <section className="">
      <Tabs
        defaultValue={defaultTabs}
        className="h-full w-full"
        onValueChange={handelTabChange}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-2">
          <div className="flex items-center gap-2">
            <Button
              className="flex items-center gap-1 px-3 text-sm"
              onClick={() => handleDialogTaskOpen("create")}
            >
              <Plus className="size-4" />{" "}
              <span className="max-md:hidden">Create Task</span>
            </Button>
          </div>
          <div className="px-4 py-2">
            <TabsList className={"flex gap-2"}>
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  disabled={tab?.disabled}
                >
                  <span className="px-0.5 py-0.5 text-xs md:text-sm">
                    {tab.title}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
        <main className="mx-4 flex-1">
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.childern}
            </TabsContent>
          ))}
        </main>
      </Tabs>
      <DialogForm
        tabinde
        title={DialogTaskVariant[dialogTask.variant]?.title}
        description={DialogTaskVariant[dialogTask.variant]?.description}
        submitText={DialogTaskVariant[dialogTask.variant]?.submit}
        form={form}
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
        formFields={[
          ...taskFormFieldsPart1,
          ...(form.watch("repeat") ? taskFormFieldsPart2 : []),
          ...taskFormFieldsPart3,
        ]}
        isOpen={dialogTask.isOpen}
        onClose={handleDialogTaskClose}
        variant={dialogTask.variant}
      />
      <SheetTask
        data={sheetTask.data}
        isOpen={sheetTask.isOpen}
        openEdit={(data) =>
          handleDialogTaskOpen("edit", data, data.compliance_task_id)
        }
        openView={(data) => setSheetTask({ isOpen: true, data })}
        onClose={() => setSheetTask({ isOpen: false, data: null })}
      />
    </section>
  );
}
