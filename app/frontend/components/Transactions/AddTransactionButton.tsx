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
import { AssetCurrencyEnum } from "@/entities/Transaction";
import dayjs from "dayjs";
import { router } from "@inertiajs/react";

const AddTransactionButton = () => {
  const transactionFormSchema = z.object({
    op_type: z.enum(["buy", "sell"]),
    date: z.string().transform((value: string) => dayjs(value).toISOString()),
    symbol: z
      .string()
      .min(3)
      .max(6, { message: "Ticker deve ter no maximo 6 caracteres" }),
    quantity: z.coerce.number().gt(0),
    cost: z.string().min(1),
    currency: z.nativeEnum(AssetCurrencyEnum),
  });

  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      op_type: "buy",
      date: dayjs().toISOString(),
      symbol: "",
      quantity: 1,
      cost: "",
      currency: AssetCurrencyEnum.BRL,
    },
  });

  const handleTransactionSubmit = async (
    values: z.infer<typeof transactionFormSchema>,
  ) => {
    router.post(
      "/operations",
      { operation: values },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
          router.reload({ only: ["data"] });
        },
        onError: (errors) => {
          console.error("Failed to create transaction:", errors);
        },
      }
    );
  };

  // eslint-disable-next-line
  const onFormError: SubmitErrorHandler<any> = (e) => {
    console.log(e);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit ml-2">
          New transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-8 sm:max-w-[425px]">
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <DialogHeader className="flex-1">
            <DialogTitle>Add new transaction</DialogTitle>
            <DialogDescription>
              Transacao ao ser adicionada ira gerar um novo investimento ou
              atualizar um existente
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="grid w-full overflow-hidden">
          <Form {...form}>
            <FormField
              control={form.control}
              name="op_type"
              render={({ field }) => (
                <FormItem className="p-2">
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger {...field}>
                        <SelectValue></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="p-2">
                  <FormLabel>Transaction Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
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
              name="quantity"
              render={({ field }) => (
                <FormItem className="p-2">
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem className="p-2">
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="eg.: 123.45" {...field} />
                  </FormControl>
                  <FormDescription>
                    Deve-se considerar emolumentos, impostos e corretagem
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="p-2">
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="eg.: USD | BRL"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        </div>
        <DialogFooter className="gap-2 sm:space-x-0">
          <Button variant="outline" onClick={() => setOpen(!open)}>
            Voltar
          </Button>
          <Button
            onClick={form.handleSubmit(handleTransactionSubmit, onFormError)}
          >
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionButton;
