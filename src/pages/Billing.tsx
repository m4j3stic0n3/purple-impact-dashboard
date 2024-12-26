import { DashboardSidebar } from "@/components/DashboardSidebar";
import { BillingForm } from "@/components/BillingForm";

const Billing = () => {
  return (
    <>
      <DashboardSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Billing Information</h1>
          <BillingForm />
        </div>
      </div>
    </>
  );
};

export default Billing;