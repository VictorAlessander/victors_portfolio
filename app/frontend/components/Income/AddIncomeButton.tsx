import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { SubmitErrorHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import dayjs from "dayjs";
import { router } from "@inertiajs/react";

const AddIncomeButton = () => {
  const incomeFormSchema = z.object({
    symbol: z
      .string()
      .min(3, { message: "Symbol must have at least 3 characters" })
      .max(10, { message: "Symbol must have at most 10 characters" }),
    income_type: z.enum(["dividend", "jcp", "bonus", "subscription_rights"]),
    amount: z.coerce.number().gt(0, { message: "Amount must be greater than 0" }),
    payment_date: z.string(),
    quantity: z.coerce.number().optional(),
    tax_withheld: z.coerce.number().optional(),
    notes: z.string().optional(),
  });

  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof incomeFormSchema>>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      symbol: "",
      income_type: "dividend",
      amount: 0,
      payment_date: dayjs().format("YYYY-MM-DD"),
      quantity: undefined,
      tax_withheld: undefined,
      notes: "",
    },
  });

  const handleIncomeSubmit = async (
    values: z.infer<typeof incomeFormSchema>,
  ) => {
    router.post(
      "/incomes",
      { income: values },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
          router.reload({ only: ["data", "summary"] });
        },
        onError: (errors) => {
          console.error("Failed to create income:", errors);
        },
      }
    );
  };

  const onFormError: SubmitErrorHandler<any> = (e) => {
    console.log(e);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-fit">
          Add Income
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-8 sm:max-w-[500px]">
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <DialogHeader className="flex-1">
            <DialogTitle>Add New Income</DialogTitle>
            <DialogDescription>
              Add a dividend, JCP, bonus or other income received
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="grid w-full overflow-hidden">
          <Form {...form}>
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem className="p-2">
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="eg.: ITUB4" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="income_type"
              render={({ field }) => (
                <FormItem className="p-2">
                  <FormLabel>Income Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger {...field}>
                        <SelectValue></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dividend">Dividend</SelectItem>
                        <SelectItem value="jcp">JCP</SelectItem>
                        <SelectItem value="bonus">Bonus</SelectItem>
                        <SelectItem value="subscription_rights">Subscription Rights</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="p-2">
                  <FormLabel>Amount (BRL)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="eg.: 500.00" {...field} />
                  </FormControl>
                  <FormDescription>
                    Total amount received (after taxes if applicable)
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_date"
              render={({ field }) => (
                <FormItem className="p-2">
                  <FormLabel>Payment Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="p-2">
                  <FormLabel>Quantity (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Number of shares" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tax_withheld"
              render={({ field }) => (
                <FormItem className="p-2">
                  <FormLabel>Tax Withheld (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="eg.: 75.00" {...field} />
                  </FormControl>
                  <FormDescription>
                    IR retido na fonte (mainly for JCP)
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="p-2">
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Any additional notes" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        </div>
        <DialogFooter className="gap-2 sm:space-x-0">
          <Button variant="outline" onClick={() => setOpen(!open)}>
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(handleIncomeSubmit, onFormError)}
          >
            Add Income
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddIncomeButton;
