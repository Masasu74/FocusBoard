import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AddTask = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="default">+ Add Task</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task to add to your focus board.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Enter task title" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Enter Description"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                type="date"
                id="dueDate"
                name="dueDate"
                placeholder="Enter Description"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>

              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Task Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inprogress">InProgress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
export default AddTask;
