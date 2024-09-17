import { createEffect, createSignal, For, JSX, onCleanup } from "solid-js";

interface OTPInputProps {
  length: number;
  onComplete: (otp: string) => void;
  onReset?: () => void;
  resetSignal?: boolean; // Add reset signal prop
}

const OTPInput = (props: OTPInputProps) => {
  const [otp, setOtp] = createSignal<string[]>(Array(props.length).fill(""));

  // Handle OTP reset when resetSignal changes
  createEffect(() => {
    if (props.resetSignal) {
      setOtp(Array(props.length).fill(""));
      const firstInput = document.getElementById("otp-input-0");
      firstInput?.focus(); // Focus the first input field
      if (props.onReset) props.onReset(); // Call onReset if provided
    }
  });

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp()];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < props.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      props.onComplete(newOtp.join(""));
    }
  };

  const handleBackspace = (index: number) => {
    const newOtp = [...otp()];
    if (index > 0 && !newOtp[index]) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        "justify-content": "space-evenly",
      }}
    >
      <For each={Array(props.length).fill(0)}>
        {(_, index) => (
          <input
            id={`otp-input-${index()}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp()[index()]}
            onInput={(e) => handleChange(index(), e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Backspace" && handleBackspace(index())}
            style={{
              width: "40px",
              height: "40px",
              "text-align": "center",
              "font-size": "20px",
            }}
          />
        )}
      </For>
    </div>
  );
};

export default OTPInput;
