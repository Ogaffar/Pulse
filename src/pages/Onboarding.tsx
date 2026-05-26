import { useState, useRef, useEffect } from "react";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { StepGoals } from "@/components/onboarding/StepGoals";
import { StepPrivacy } from "@/components/onboarding/StepPrivacy";
import { StepContacts } from "@/components/onboarding/StepContacts";
import { StepFrequency } from "@/components/onboarding/StepFrequency";
import { OnboardingComplete } from "@/components/onboarding/OnboardingComplete";

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [animating, setAnimating] = useState(false);

  // Step 1 state
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");

  // Step 2 state
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    contacts: true,
    gmail: false,
    linkedin: false,
    messaging: false,
  });

  // Step 3 state
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [addedContacts, setAddedContacts] = useState<string[]>([]);

  // Step 4 state
  const [selectedFreq, setSelectedFreq] = useState("weekly");
  const [selectedTime, setSelectedTime] = useState("morning");

  // Completion
  const [completed, setCompleted] = useState(false);

  const goNext = () => {
    if (step === TOTAL_STEPS) {
      setCompleted(true);
      return;
    }
    setDirection("forward");
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setAnimating(false);
    }, 300);
  };

  const goBack = () => {
    setDirection("back");
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s - 1);
      setAnimating(false);
    }, 300);
  };

  if (completed) return <OnboardingComplete />;

  const isCtaDisabled = (() => {
    if (step === 1) return selectedGoals.length === 0;
    return false;
  })();

  const ctaLabel = (() => {
    if (step === 2) return "I understand — continue";
    if (step === 4) return "Start building with Pulse →";
    return "Continue →";
  })();

  const skipLabel = (() => {
    if (step === 2) return "I'll grant access later";
    return "Skip for now";
  })();

  const slideStyle: React.CSSProperties = animating
    ? {
        transform: direction === "forward" ? "translateX(-30px)" : "translateX(30px)",
        opacity: 0,
        transition: "all 300ms ease",
      }
    : {
        transform: "translateX(0)",
        opacity: 1,
        transition: "all 300ms ease",
      };

  return (
    <OnboardingLayout
      step={step}
      totalSteps={TOTAL_STEPS}
      ctaLabel={ctaLabel}
      ctaDisabled={isCtaDisabled}
      onCta={goNext}
      onBack={step > 1 ? goBack : undefined}
      onSkip={step <= 3 ? goNext : undefined}
      skipLabel={skipLabel}
      ctaLarge={step === 4}
    >
      <div style={slideStyle}>
        {step === 1 && (
          <StepGoals
            selected={selectedGoals}
            onSelect={setSelectedGoals}
            otherText={otherText}
            onOtherText={setOtherText}
          />
        )}
        {step === 2 && (
          <StepPrivacy toggles={toggles} onToggle={(id) => setToggles((t) => ({ ...t, [id]: !t[id] }))} />
        )}
        {step === 3 && (
          <StepContacts
            selectedSources={selectedSources}
            onToggleSource={(id) =>
              setSelectedSources((s) =>
                s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
              )
            }
            addedContacts={addedContacts}
            onAddContact={(name) => setAddedContacts((c) => [...c, name])}
            onRemoveContact={(name) => setAddedContacts((c) => c.filter((n) => n !== name))}
          />
        )}
        {step === 4 && (
          <StepFrequency
            selectedFreq={selectedFreq}
            onSelectFreq={setSelectedFreq}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
          />
        )}
      </div>
    </OnboardingLayout>
  );
}
