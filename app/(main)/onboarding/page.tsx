"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setUserRole } from "@/app/api/actions/onboarding";
import { MainMenusGradientCard } from "@/components/eldoraui/animatedcard";
import { OnboardingSkeleton } from "@/components/ui/dashboard-skeleton";

type OnboardingResponse = {
  success: boolean;
  redirect?: string;
  error?: string;
};

export default function OnboardingPage() {
  const [step, setStep] = useState<"choose-role" | "worker-form" | "customer-form">("choose-role");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return <OnboardingSkeleton />;
  }

  const handleRoleSelection = (role: "customer" | "worker") => {
    if (role === "customer") {
      setStep("customer-form");
    } else {
      setStep("worker-form");
    }
  };

  const handleCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("role", "CUSTOMER");

    try {
      const response = await setUserRole(formData);
      if (response.success && response.redirect) {
        router.push(response.redirect);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleWorkerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("role", "WORKER");

    // Handle comma-separated values
    const skilledIn = formData.get("skilledIn") as string;
    const certificates = formData.get("certificates") as string;
    const availableAreas = formData.get("availableAreas") as string;

    if (skilledIn) {
      const skillsArray = skilledIn.split(',').map(s => s.trim()).filter(Boolean);
      formData.set("skilledIn", JSON.stringify(skillsArray));
    }
    if (certificates) {
      const certsArray = certificates.split(',').map(s => s.trim()).filter(Boolean);
      formData.set("certificates", JSON.stringify(certsArray));
    }
    if (availableAreas) {
      const areasArray = availableAreas.split(',').map(s => s.trim()).filter(Boolean);
      formData.set("availableAreas", JSON.stringify(areasArray));
    }

    try {
      const response = await setUserRole(formData);
      if (response.success && response.redirect) {
        router.push(response.redirect);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Role Selection
  if (step === "choose-role") {
    return (
      <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "600", color: "#111827", marginBottom: "1rem" }}>
            Choose Your Role
          </h1>
          <p style={{ fontSize: "1.25rem", color: "#6b7280" }}>
            Select how you want to use RozgaarSetu
          </p>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginTop: "20px" }}>
          
          {/* Customer Option */}
          <div onClick={() => handleRoleSelection("customer")} style={{ cursor: "pointer" }}>
            <MainMenusGradientCard
              title="Join as Customer"
              description="Book workers, manage service requests and track jobs. Find skilled professionals for your needs."
              withArrow={true}
              circleSize={300}
            >
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "100%",
                gap: "1rem"
              }}>
                <div style={{ fontSize: "4rem" }}>👤</div>
                <button 
                  style={{ 
                    padding: "12px 24px", 
                    backgroundColor: "#3b82f6", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                  }}
                >
                  Continue as Customer
                </button>
              </div>
            </MainMenusGradientCard>
          </div>

          {/* Worker Option */}
          <div onClick={() => handleRoleSelection("worker")} style={{ cursor: "pointer" }}>
            <MainMenusGradientCard
              title="Join as Worker"
              description="Create your profile, list your skills, and get hired for jobs. Start earning with your expertise."
              withArrow={true}
              circleSize={300}
            >
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "100%",
                gap: "1rem"
              }}>
                <div style={{ fontSize: "4rem" }}>🔧</div>
                <button 
                  style={{ 
                    padding: "12px 24px", 
                    backgroundColor: "#10b981", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                  }}
                >
                  Continue as Worker
                </button>
              </div>
            </MainMenusGradientCard>
          </div>
        </div>
      </div>
    );
  }

  // Customer Form
  if (step === "customer-form") {
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h2>Complete Your Customer Profile</h2>
        {error && (
          <div style={{ 
            padding: "10px", 
            backgroundColor: "#f8d7da", 
            color: "#721c24", 
            border: "1px solid #f5c6cb", 
            borderRadius: "4px", 
            marginBottom: "20px" 
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleCustomerSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input 
            name="address" 
            placeholder="Address" 
            required 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="city" 
            placeholder="City" 
            required 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="state" 
            placeholder="State" 
            required 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="country" 
            placeholder="Country" 
            required 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="postalCode" 
            placeholder="Postal Code" 
            required 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: "12px", 
              backgroundColor: loading ? "#6c757d" : "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px"
            }}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    );
  }

  // Worker Form
  if (step === "worker-form") {
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h2>Complete Your Worker Profile</h2>
        {error && (
          <div style={{ 
            padding: "10px", 
            backgroundColor: "#f8d7da", 
            color: "#721c24", 
            border: "1px solid #f5c6cb", 
            borderRadius: "4px", 
            marginBottom: "20px" 
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleWorkerSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input 
            name="aadharNumber" 
            placeholder="Aadhar Number (12 digits)" 
            required 
            pattern="[0-9]{12}"
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="qualification" 
            placeholder="Qualification" 
            required 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="skilledIn" 
            placeholder="Skills (comma separated)" 
            required 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="yearsExperience" 
            placeholder="Years of Experience" 
            type="number" 
            min="0"
            required 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="certificates" 
            placeholder="Certificates (comma separated, optional)" 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="profilePic" 
            placeholder="Profile Picture URL (optional)" 
            type="url"
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <textarea 
            name="bio" 
            placeholder="Bio (optional)" 
            rows={3}
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px", resize: "vertical" }}
          />
          <input 
            name="availableAreas" 
            placeholder="Available Areas (comma separated, optional)" 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="address" 
            placeholder="Address" 
            required 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="city" 
            placeholder="City" 
            required 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="state" 
            placeholder="State" 
            required 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="country" 
            placeholder="Country" 
            required 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="postalCode" 
            placeholder="Postal Code" 
            required 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: "12px", 
              backgroundColor: loading ? "#6c757d" : "#28a745", 
              color: "white", 
              border: "none", 
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px"
            }}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    );
  }

  return null;
}
