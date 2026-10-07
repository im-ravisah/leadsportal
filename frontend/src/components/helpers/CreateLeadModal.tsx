import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";

const createLeadSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  skypeId: z.string().optional(),
  phoneNumber: z.string().optional(),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  agency: z.string().min(1, "Agency is required"),
  status: z.string().min(1, "Status is required"),
  source: z.string().min(1, "Source is required"),
  leadOwnership: z.string().optional(),
  industry: z.string().min(1, "Industry is required"),
  companyName: z.string().min(1, "Company name is required"),
  technicalPerson: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

type CreateLeadFormData = z.infer<typeof createLeadSchema>;

interface CreateLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateLeadFormData) => void;
}

export function CreateLeadModal({ open, onOpenChange, onSubmit }: CreateLeadModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateLeadFormData>({
    resolver: zodResolver(createLeadSchema),
  });

  const onFormSubmit = (data: CreateLeadFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Lead</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">
                Client name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("clientName")}
                placeholder="Enter client name"
                className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.clientName && (
                <p className="text-xs text-red-500">{errors.clientName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter client email"
                className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Skype ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">
                Skype ID
              </label>
              <input
                {...register("skypeId")}
                placeholder="Enter client Skype ID"
                className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">
                Phone Number
              </label>
              <input
                type="tel"
                {...register("phoneNumber")}
                placeholder="Enter client phone number"
                className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">
                City <span className="text-red-500">*</span>
              </label>
              <input
                {...register("city")}
                placeholder="Enter client city"
                className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city.message}</p>
              )}
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                {...register("country")}
                className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select client country</option>
                <option value="usa">USA</option>
                <option value="uk">UK</option>
                <option value="india">India</option>
                <option value="canada">Canada</option>
              </select>
              {errors.country && (
                <p className="text-xs text-red-500">{errors.country.message}</p>
              )}
            </div>

            {/* Agency */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">
                Agency <span className="text-red-500">*</span>
              </label>
              <select
                {...register("agency")}
                className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Please select agency</option>
                <option value="agency1">Agency 1</option>
                <option value="agency2">Agency 2</option>
              </select>
              {errors.agency && (
                <p className="text-xs text-red-500">{errors.agency.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register("status")}
                className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select status</option>
                <option value="HOT">HOT</option>
                <option value="WARM">WARM</option>
                <option value="COLD">COLD</option>
                <option value="PRIME_PROSPECTS">Prime Prospects</option>
                <option value="PARTNER">Partner</option>
                <option value="AWARDED">Awarded</option>
                <option value="DELAYED">Delayed</option>
              </select>
              {errors.status && (
                <p className="text-xs text-red-500">{errors.status.message}</p>
              )}
            </div>

            {/* Source */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">
                Source <span className="text-red-500">*</span>
              </label>
              <select
                {...register("source")}
                className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select source</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social">Social Media</option>
                <option value="email">Email</option>
              </select>
              {errors.source && (
                <p className="text-xs text-red-500">{errors.source.message}</p>
              )}
            </div>

            {/* Lead Ownership */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">
                Lead Ownership
              </label>
              <select
                {...register("leadOwnership")}
                className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select assignee</option>
                <option value="assignee1">Assignee 1</option>
                <option value="assignee2">Assignee 2</option>
              </select>
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                {...register("industry")}
                className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select client industry</option>
                <option value="tech">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="retail">Retail</option>
              </select>
              {errors.industry && (
                <p className="text-xs text-red-500">{errors.industry.message}</p>
              )}
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("companyName")}
                placeholder="Enter client company name"
                className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.companyName && (
                <p className="text-xs text-red-500">{errors.companyName.message}</p>
              )}
            </div>

            {/* Technical Person */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">
                Technical Person
              </label>
              <input
                {...register("technicalPerson")}
                placeholder="Enter technical person"
                className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-white">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("message")}
              placeholder="Enter client message"
              rows={4}
              className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            {errors.message && (
              <p className="text-xs text-red-500">{errors.message.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create Lead</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
