"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Wrench, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { setUserRole } from "@/app/api/actions/onboarding";
import useFetch from "@/hooks/use-fetch";
import {
  workerFormSchema,
  customerFormSchema,
  type WorkerFormData,
  type CustomerFormData,
} from "@/lib/schema";

// --- expected server response ---
type OnboardingResponse = {
  success: boolean;
  redirect: string;
};

export default function OnboardingPage() {
  const [step, setStep] = useState<
    "choose-role" | "worker-form" | "customer-form"
  >("choose-role");
  const router = useRouter();

  const {
    loading,
    data,
    fn: submitUserRole,
  } = useFetch<OnboardingResponse, FormData>(setUserRole);

  // ----------------- Customer form -----------------
  const {
    register: registerCustomer,
    handleSubmit: handleCustomerSubmit,
    formState: { errors: customerErrors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  // ----------------- Worker form -----------------
  const {
    register: registerWorker,
    handleSubmit: handleWorkerSubmit,
    formState: { errors: workerErrors },
  } = useForm<WorkerFormData>({
    resolver: zodResolver(workerFormSchema),
    defaultValues: {
      skilledIn: [],
      qualification: "",
      certificates: [],
      aadharNumber: "",
      yearsExperience: undefined,
      profilePic: "",
      bio: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      availableAreas: [],
    },
  });

  // ----------------- Redirect after success -----------------
  useEffect(() => {
    if (data?.success && data.redirect) {
      router.push(data.redirect);
    }
  }, [data, router]);

  // ----------------- Submit Handlers -----------------
  const onCustomerSubmit = async (formDataValues: CustomerFormData) => {
    if (loading) return;
    const formData = new FormData();
    formData.append("role", "CUSTOMER");

    Object.entries(formDataValues).forEach(([key, val]) => {
      formData.append(key, String(val));
    });

    await submitUserRole(formData);
  };

  const onWorkerSubmit = async (formDataValues: WorkerFormData) => {
    if (loading) return;
    const formData = new FormData();
    formData.append("role", "WORKER");

    Object.entries(formDataValues).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        formData.append(key, JSON.stringify(val)); // serialize arrays
      } else if (val !== undefined && val !== null) {
        formData.append(key, String(val));
      }
    });

    await submitUserRole(formData);
  };

  // ----------------- UI -----------------
  if (step === "choose-role") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer card */}
        <Card
          className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
          onClick={() => setStep("customer-form")}
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
              <User className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-2">
              Join as a Customer
            </CardTitle>
            <CardDescription className="mb-4">
              Book workers, manage your service requests and track jobs.
            </CardDescription>
            <Button className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700">
              Continue as Customer
            </Button>
          </CardContent>
        </Card>

        {/* Worker card */}
        <Card
          className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
          onClick={() => setStep("worker-form")}
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
              <Wrench className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-2">
              Join as a Worker
            </CardTitle>
            <CardDescription className="mb-4">
              Create your profile, list your skills, and get hired for jobs.
            </CardDescription>
            <Button className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700">
              Continue as Worker
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ----------------- Customer Form -----------------
  if (step === "customer-form") {
    return (
      <Card className="border-emerald-900/20">
        <CardContent className="pt-6">
          <CardTitle className="text-2xl font-bold text-white mb-2">
            Complete Your Customer Profile
          </CardTitle>
          <form
            onSubmit={handleCustomerSubmit(onCustomerSubmit)}
            className="space-y-4"
          >
            <Input placeholder="Address" {...registerCustomer("address")} />
            {customerErrors.address && (
              <p className="text-red-500 text-sm">
                {customerErrors.address.message}
              </p>
            )}

            <Input placeholder="City" {...registerCustomer("city")} />
            <Input placeholder="State" {...registerCustomer("state")} />
            <Input placeholder="Country" {...registerCustomer("country")} />
            <Input
              placeholder="Postal Code"
              {...registerCustomer("postalCode")}
            />

            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // ----------------- Worker Form -----------------
  if (step === "worker-form") {
    return (
      <Card className="border-emerald-900/20">
        <CardContent className="pt-6">
          <CardTitle className="text-2xl font-bold text-white mb-2">
            Complete Your Worker Profile
          </CardTitle>
          <form
            onSubmit={handleWorkerSubmit(onWorkerSubmit)}
            className="space-y-4"
          >
            <Input
              placeholder="Aadhar Number"
              {...registerWorker("aadharNumber")}
            />
            <Input
              placeholder="Qualification"
              {...registerWorker("qualification")}
            />
            <Input
              placeholder="Certificates (comma separated)"
              {...registerWorker("certificates")}
            />
            <Input
              placeholder="Years of Experience"
              type="number"
              {...registerWorker("yearsExperience", { valueAsNumber: true })}
            />
            <Input
              placeholder="Profile Picture URL"
              {...registerWorker("profilePic")}
            />
            <Textarea placeholder="Bio" {...registerWorker("bio")} />
            <Input
              placeholder="Skilled In (comma separated)"
              {...registerWorker("skilledIn")}
            />
            <Input
              placeholder="Available Areas (comma separated)"
              {...registerWorker("availableAreas")}
            />
            <Input placeholder="Address" {...registerWorker("address")} />
            <Input placeholder="City" {...registerWorker("city")} />
            <Input placeholder="State" {...registerWorker("state")} />
            <Input placeholder="Country" {...registerWorker("country")} />
            <Input
              placeholder="Postal Code"
              {...registerWorker("postalCode")}
            />

            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return null;
}
